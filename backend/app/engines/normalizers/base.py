import hashlib
import json
import logging
from typing import Optional
import pkgutil
import importlib

logger = logging.getLogger(__name__)

normalizer_registry = {}

def normalizer(service: str):
    def decorator(cls):
        normalizer_registry[service] = cls()
        logger.info(f"[Normalizer] Registered normalizer for {service}")
        return cls
    return decorator

def discover_normalizers(package_name="app.engines.normalizers"):
    import app.engines.normalizers
    for _, module_name, _ in pkgutil.iter_modules(app.engines.normalizers.__path__):
        if module_name == "base":
            continue
        try:
            importlib.import_module(f"{package_name}.{module_name}")
        except Exception as e:
            logger.error(f"Failed to load normalizer module {module_name}: {e}")

class BaseNormalizer:

    """
    Converts raw AWS API responses into
    the standard Node/Edge format for React Flow.
    """

    # ─────────────────────────────────────────
    # FINGERPRINT
    # ─────────────────────────────────────────

    def generate_fingerprint(self, data: dict) -> str:
        """
        Generate SHA256 hash of resource data.
        If hash changes between versions = resource was modified.
        """
        # Sort keys so order doesn't affect hash
        data_string = json.dumps(data, sort_keys=True, default=str)
        return hashlib.sha256(data_string.encode()).hexdigest()

    # ─────────────────────────────────────────
    # BUILD NODE
    # ─────────────────────────────────────────

    def build_node(
        self,
        resource_arn: str,
        node_type: str,
        name: str,
        service: str,
        region: str,
        account_id: str,
        metrics: dict,
        insights: str = "",
        parent_arn: Optional[str] = None,
        extra_data: dict = {}
    ) -> dict:
        """
        Build a standard React Flow node.
        parentID is only added if it exists — never null.
        """
        node = {
            "id": resource_arn,
            "type": node_type,
            "position": {"x": 0, "y": 0},
            "data": {
                "name": name,
                "insights": insights,
                "service": service,
                "region": region,
                "account_id": account_id,
                "resource_arn": resource_arn,
                "metrics": metrics,
                **extra_data
            }
        }

        # Only add parentID if it actually has a value
        if parent_arn:
            node["parentID"] = parent_arn
            node["parentId"] = parent_arn

        return node

    # ─────────────────────────────────────────
    # BUILD EDGE
    # ─────────────────────────────────────────

    def build_edge(
        self,
        source_arn: str,
        target_arn: str,
        label: str
    ) -> dict:
        """
        Build a standard React Flow edge.
        Always uses animatedEdge type.
        """
        uid = hashlib.sha256(f"{source_arn}|{label}|{target_arn}".encode()).hexdigest()[:8]
        edge_id = f"edge-{uid}"
        return {
            "id": edge_id,
            "source": source_arn,
            "target": target_arn,
            "type": "animatedEdge",
            "label": label
        }

    # ─────────────────────────────────────────
    # VPC NORMALIZER
    # ─────────────────────────────────────────

    def _scan_vpc(self, vpc: dict) -> str:
        if vpc.get('IsDefault'):
            return "Warning: Using default VPC"
        return "Pass"

    def _scan_rds(self, db: dict) -> str:
        if db.get('PubliclyAccessible'):
            return "Warning: Database is publicly accessible"
        if not db.get('MultiAZ'):
            return "Warning: Multi-AZ not enabled"
        return "Pass"

    def _scan_ec2(self, instance: dict) -> str:
        """Basic security checks for EC2 instance."""
        public_ip = instance.get('PublicIpAddress')
        state = instance.get('State', {}).get('Name', '')

        if public_ip and state == 'running':
            return "Warning: Instance has public IP"
        if state == 'stopped':
            return "Info: Instance is stopped"
        return "Pass"

    # ─────────────────────────────────────────
    # TAG HELPER
    # ─────────────────────────────────────────

    def _get_tag(self, resource: dict, key: str) -> Optional[str]:
        """Extract tag value from AWS tags list."""
        tags = resource.get('Tags', [])
        for tag in tags:
            if tag['Key'] == key:
                return tag['Value']
        return None

    def _extract_principals(self, assume_role_doc: dict) -> list:
        """Extract service principals from AssumeRolePolicyDocument."""
        principals = []
        for stmt in assume_role_doc.get('Statement', []):
            p = stmt.get('Principal', {})
            if isinstance(p, str):
                principals.append(p)
            elif isinstance(p, dict):
                for v in p.values():
                    if isinstance(v, list):
                        principals.extend(v)
                    elif isinstance(v, str):
                        principals.append(v)
        return principals

    # ─────────────────────────────────────────
    # EVENTBRIDGE NORMALIZER
    # ─────────────────────────────────────────
