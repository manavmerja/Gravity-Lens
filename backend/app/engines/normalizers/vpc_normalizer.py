import logging
from app.engines.normalizers.base import BaseNormalizer, normalizer

logger = logging.getLogger(__name__)

@normalizer(service="vpc")
class VpcNormalizer(BaseNormalizer):
    def normalize(self, vpc: dict, region: str, account_id: str, endpoints: list = None, security_groups: list = None, route_tables: list = None, enis: list = None) -> dict:
        """
        Convert raw AWS VPC response into standard node format.
        """
        vpc_id = vpc['VpcId']
        resource_arn = f"arn:aws:ec2:{region}:{account_id}:vpc/{vpc_id}"

        # Get name from tags
        name = self._get_tag(vpc, 'Name') or vpc_id

        # Check if default VPC
        is_default = vpc.get('IsDefault', False)

        metrics = {
            "cidrBlock": vpc.get('CidrBlock', 'N/A'),
            "state": vpc.get('State', 'N/A'),
            "isDefault": is_default,
            "region": region,
            "securityScan": self._scan_vpc(vpc),
            "endpoints": endpoints or [],
            "securityGroups": security_groups or [],
            "routeTables": route_tables or [],
            "enis": enis or []
        }

        insights = "Default VPC" if is_default else "Custom VPC"

        node = self.build_node(
            resource_arn=resource_arn,
            node_type="vpcNode",
            name=name,
            service="vpc",
            region=region,
            account_id=account_id,
            metrics=metrics,
            insights=insights
        )

        # Generate fingerprint from metrics
        fingerprint = self.generate_fingerprint(metrics)

        return {
            "node": node,
            "fingerprint": fingerprint,
            "resource_arn": resource_arn,
            "resource_name": name,
            "vpc_id": vpc_id,
            "raw_id": vpc_id
        }

    # ─────────────────────────────────────────
    # SUBNET NORMALIZER
    # ─────────────────────────────────────────

