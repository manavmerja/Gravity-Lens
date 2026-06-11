# Normalization Route - Fetches data from DB and normalizes it

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import or_
from uuid import UUID as UUIDClass
from app.database import get_db
from app.models.models import AwsAccount, Snapshot, Resource, Relationship
from app.engines.normalizer import NormalizationEngine
import logging
import json

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/normalize", tags=["Normalization"])

# ─────────────────────────────────────────
# REQUEST/RESPONSE SCHEMAS
# ─────────────────────────────────────────

class NormalizeAccountRequest(BaseModel):
    """Request to normalize an account's latest snapshot"""
    account_id: str  # AWS 12-digit account ID or database UUID
    only_new: Optional[bool] = False


class NormalizedResourceResponse(BaseModel):
    """Single normalized resource"""
    node: Dict[str, Any]
    fingerprint: str
    resource_arn: str


class NormalizeAccountResponse(BaseModel):
    """Response with normalized account data"""
    success: bool
    message: str
    account_name: Optional[str] = None
    snapshot_version: Optional[int] = None
    total_resources: int = 0
    nodes: List[Dict[str, Any]] = []
    edges: List[Dict[str, Any]] = []


# ─────────────────────────────────────────
# INITIALIZE NORMALIZER
# ─────────────────────────────────────────

normalizer = NormalizationEngine()


# ─────────────────────────────────────────
# NORMALIZE ACCOUNT - FETCH FROM DB
# ─────────────────────────────────────────

@router.post("/account", response_model=NormalizeAccountResponse)
def normalize_account(
    request: NormalizeAccountRequest,
    db: Session = Depends(get_db)
):
    """
    Fetch latest snapshot for an AWS account from database
    and normalize all resources into React Flow format.
    
    Input: account_id (AWS 12-digit or database UUID)
    Returns: Normalized nodes and edges ready for visualization.
    
    NOTE:
    - Only supported services are returned (vpc, subnet, ec2, lambda, rds, sqs, s3, apigateway).
    - VPC and Subnet are included as nodes (for hierarchy nesting via parentID)
      but are NEVER used as edge source or target.
    - Edges only represent real communication flows: invokes, triggers, writes_to, etc.
    """
    try:
        # Step 1: Find the AWS account
        parsed_uuid = None
        try:
            parsed_uuid = UUIDClass(request.account_id)
        except ValueError:
            parsed_uuid = None

        query = db.query(AwsAccount)
        if parsed_uuid:
            account = query.filter(
                or_(
                    AwsAccount.id == parsed_uuid,
                    AwsAccount.account_id == request.account_id,
                )
            ).first()
        else:
            account = query.filter(AwsAccount.account_id == request.account_id).first()

        if not account:
            raise HTTPException(
                status_code=404,
                detail=f"AWS Account {request.account_id} not found"
            )

        logger.info(f"Found account: {account.account_name} ({account.account_id})")

        # Step 2: Get latest snapshot for this account
        latest_snapshot = db.query(Snapshot).filter(
            Snapshot.account_id == account.id,
            Snapshot.is_latest == True
        ).first()

        if not latest_snapshot:
            return NormalizeAccountResponse(
                success=False,
                message=f"No snapshots found for account {account.account_name}",
                account_name=account.account_name,
                total_resources=0,
                nodes=[],
                edges=[]
            )

        logger.info(f"Found snapshot version {latest_snapshot.version_number}")

        # Step 3: Fetch all resources from snapshot
        # Only include the supported services — ignore anything else from old scans
        SUPPORTED_SERVICES = {"vpc", "subnet", "ec2", "lambda", "rds", "sqs", "s3", "apigateway", "eventbridge"}

        resources = db.query(Resource).filter(
            Resource.snapshot_id == latest_snapshot.id,
            Resource.service.in_(SUPPORTED_SERVICES)
        ).all()

        if request.only_new:
            # Find the previous snapshot for this account
            previous_snapshot = db.query(Snapshot).filter(
                Snapshot.account_id == account.id,
                Snapshot.version_number < latest_snapshot.version_number
            ).order_by(Snapshot.version_number.desc()).first()

            if previous_snapshot:
                # Find all node IDs from the previous snapshot
                previous_resources = db.query(Resource).filter(
                    Resource.snapshot_id == previous_snapshot.id
                ).all()
                previous_node_ids = {r.node_id for r in previous_resources}
                
                # Filter resources to only those that were NOT present in the previous snapshot
                resources = [r for r in resources if r.node_id not in previous_node_ids]

        if not resources:
            return NormalizeAccountResponse(
                success=True,
                message=f"Snapshot has no supported resources",
                account_name=account.account_name,
                snapshot_version=latest_snapshot.version_number,
                total_resources=0,
                nodes=[],
                edges=[]
            )

        logger.info(f"Found {len(resources)} supported resources in snapshot")

        # Step 4: Normalize each resource into React Flow node format
        nodes = []
        arn_to_node = {}

        # Collect VPC and Subnet ARNs — these are NEVER edge endpoints,
        # they only appear as nodes for hierarchy (parentID nesting)
        vpc_subnet_arns = set()

        resource_node_ids = {r.node_id for r in resources}

        for resource in resources:
            try:
                metadata = resource.meta_data or {}
                region = resource.region
                service = resource.service
                node_type = resource.node_type

                node = {
                    "id": resource.resource_arn,
                    "type": node_type,
                    "position": {"x": 0, "y": 0},
                    "data": {
                        "name": resource.resource_name,
                        "service": service,
                        "region": region,
                        "account_id": resource.account_id,
                        "resource_arn": resource.resource_arn,
                        "insights": metadata.get("insights", ""),
                        "metrics": metadata.get("metrics", {}),
                        "tags": metadata.get("tags", {})
                    }
                }

                # Add parentID for hierarchy nesting (VPC→Subnet, Subnet→EC2/Lambda/RDS)
                if resource.parent_node_id:
                    # Only assign parentID if the parent resource is in our list of resources to return
                    if resource.parent_node_id in resource_node_ids:
                        node["parentID"] = resource.parent_node_id
                        node["parentId"] = resource.parent_node_id

                nodes.append(node)
                arn_to_node[resource.resource_arn] = node

                # Mark VPC and Subnet ARNs so we can exclude them from edges
                if service in ("vpc", "subnet"):
                    vpc_subnet_arns.add(resource.resource_arn)

                logger.info(f"✓ Normalized: {node_type} - {resource.resource_name}")

            except Exception as e:
                logger.error(f"✗ Failed to normalize resource {resource.node_id}: {str(e)}")
                continue

        # Step 5: Compute edges from node metadata (no AWS calls, works immediately)
        # Also merges any edges stored in DB relationships table.
        # VPC/Subnet are NEVER edge endpoints — hierarchy is via parentId.
        edges = []
        seen_edge_keys = set()

        def make_edge(src, tgt, label, confidence, evidence, edge_id=None):
            """Build edge dict and deduplicate by (source, target, label)."""
            key = (src, tgt, label)
            if key in seen_edge_keys:
                return
            if src in vpc_subnet_arns or tgt in vpc_subnet_arns:
                return
            if src not in arn_to_node or tgt not in arn_to_node:
                return
            seen_edge_keys.add(key)
            eid = edge_id or f"edge-{src[-10:]}-{tgt[-10:]}"
            edges.append({
                "id": eid,
                "source": src,
                "target": tgt,
                "type": "animatedEdge",
                "label": label,
                "confidence": confidence,
                "evidence": evidence
            })

        def strip_q(arn):
            """Remove Lambda version/alias qualifier."""
            if not arn:
                return arn
            parts = arn.split(":")
            return ":".join(parts[:7]) if len(parts) > 7 else arn

        def get_metrics(node):
            return node.get("data", {}).get("metrics", {})

        # Group nodes by service for easy lookup
        by_service = {}
        for arn, node in arn_to_node.items():
            svc = node.get("data", {}).get("service", "")
            by_service.setdefault(svc, []).append((arn, node))

        # ── Step 5b: Infer missing nodes from metadata references ─────────────
        # If a Lambda ESM / APIGateway integration / EventBridge target references
        # a node that is NOT yet in the DB, we synthesise a minimal "virtual" node.
        # This allows edges to be rendered immediately without requiring a full re-scan.
        # Virtual nodes carry "inferred": True so the frontend can style them differently.
        already_inferred: set = set()

        def _infer_node(arn: str, svc: str, node_type: str, name: str, region: str, extra_metrics: dict = {}):
            """Add a virtual node if the ARN is not already known."""
            if not arn or arn in arn_to_node or arn in already_inferred:
                return
            already_inferred.add(arn)
            virtual = {
                "id": arn,
                "type": node_type,
                "position": {"x": 0, "y": 0},
                "data": {
                    "name": name,
                    "service": svc,
                    "region": region,
                    "account_id": account.account_id,
                    "resource_arn": arn,
                    "insights": f"Inferred — not yet scanned",
                    "metrics": {"region": region, "inferred": True, **extra_metrics},
                    "tags": {}
                },
                "inferred": True     # frontend hint: render with dashed border / lighter style
            }
            nodes.append(virtual)
            arn_to_node[arn] = virtual
            by_service.setdefault(svc, []).append((arn, virtual))
            logger.info(f"[Inferred] virtual {svc} node: {name} ({arn})")

        def _parse_region(arn: str) -> str:
            parts = arn.split(":")
            return parts[3] if len(parts) > 3 else "unknown"

        # 1. SQS / Kinesis queues referenced in Lambda ESMs
        for lam_arn, lam_node in list(by_service.get("lambda", [])):
            for esm in get_metrics(lam_node).get("eventSourceMappings", []):
                src = (esm.get("eventSourceArn") or esm.get("EventSourceArn", "")).strip()
                if not src:
                    continue
                if ":sqs:" in src:
                    _infer_node(src, "sqs", "sqsNode", src.split(":")[-1], _parse_region(src),
                                {"type": "Standard"})
                elif ":kinesis:" in src:
                    _infer_node(src, "kinesis", "kinesisNode", src.split("/")[-1], _parse_region(src))

        # 2. Lambda functions referenced in APIGateway integrations
        for apigw_arn, apigw_node in list(by_service.get("apigateway", [])):
            for uri in get_metrics(apigw_node).get("integrations", []):
                if not isinstance(uri, str) or "/functions/" not in uri:
                    continue
                func_arn = strip_q(uri.split("/functions/")[1].split("/invocations")[0])
                if func_arn:
                    _infer_node(func_arn, "lambda", "lambdaNode", func_arn.split(":")[-1],
                                _parse_region(func_arn), {"runtime": "unknown"})

        # 3. Lambda / SQS targets referenced in EventBridge rules
        for eb_arn, eb_node in list(by_service.get("eventbridge", [])):
            for tgt in get_metrics(eb_node).get("targets", []):
                tgt_arn = strip_q((tgt.get("Arn") or tgt.get("arn", "")).strip())
                if not tgt_arn:
                    continue
                if ":lambda:" in tgt_arn:
                    _infer_node(tgt_arn, "lambda", "lambdaNode", tgt_arn.split(":")[-1],
                                _parse_region(tgt_arn), {"runtime": "unknown"})
                elif ":sqs:" in tgt_arn:
                    _infer_node(tgt_arn, "sqs", "sqsNode", tgt_arn.split(":")[-1],
                                _parse_region(tgt_arn), {"type": "Standard"})

        # 4. Lambda functions referenced in S3 bucket notification configs
        for s3_arn, s3_node in list(by_service.get("s3", [])):
            notif = get_metrics(s3_node).get("notificationConfiguration", {})
            for cfg in notif.get("LambdaFunctionConfigurations", []):
                func_arn = strip_q(cfg.get("LambdaFunctionArn", ""))
                if func_arn:
                    _infer_node(func_arn, "lambda", "lambdaNode", func_arn.split(":")[-1],
                                _parse_region(func_arn), {"runtime": "unknown"})

        # ── [100] SQS → Lambda via Event Source Mapping ──────────────────────
        for lam_arn, lam_node in by_service.get("lambda", []):
            for esm in get_metrics(lam_node).get("eventSourceMappings", []):
                src_arn = esm.get("eventSourceArn") or esm.get("EventSourceArn", "")
                if src_arn:
                    make_edge(src_arn, lam_arn, "triggers", 100, ["event_source_mapping"])

        # ── [100] S3 → Lambda via bucket notification config ─────────────────
        for s3_arn, s3_node in by_service.get("s3", []):
            notif = get_metrics(s3_node).get("notificationConfiguration", {})
            for cfg in notif.get("LambdaFunctionConfigurations", []):
                func_arn = strip_q(cfg.get("LambdaFunctionArn", ""))
                if func_arn:
                    make_edge(s3_arn, func_arn, "triggers", 100, ["s3_bucket_notification"])

        # ── [100] APIGateway → Lambda via integration URI ─────────────────────
        for apigw_arn, apigw_node in by_service.get("apigateway", []):
            for uri in get_metrics(apigw_node).get("integrations", []):
                if isinstance(uri, str) and "/functions/" in uri and "/invocations" in uri:
                    raw = uri.split("/functions/")[1].split("/invocations")[0]
                    func_arn = strip_q(raw)
                    if func_arn:
                        make_edge(apigw_arn, func_arn, "invokes", 100, ["api_gateway_integration"])

        # ── [100] EventBridge → Lambda / SQS via rule targets ────────────────
        for eb_arn, eb_node in by_service.get("eventbridge", []):
            for tgt in get_metrics(eb_node).get("targets", []):
                tgt_arn = strip_q(tgt.get("Arn") or tgt.get("arn", ""))
                if tgt_arn:
                    make_edge(eb_arn, tgt_arn, "triggers", 100, ["eventbridge_rule_target"])

        # ── [70] EC2 → RDS via Security Group overlap ─────────────────────────
        # Build sg_id → ingress rules from VPC node metrics
        sg_ingress = {}
        for vpc_arn, vpc_node in by_service.get("vpc", []):
            for sg in get_metrics(vpc_node).get("securityGroups", []):
                sg_id = sg.get("groupId")
                if not sg_id:
                    continue
                rules = []
                for perm in sg.get("ipPermissions", []):
                    for pair in perm.get("userIdGroupPairs", []):
                        src_sg = pair.get("groupId")
                        if src_sg:
                            rules.append({"sourceGroup": src_sg,
                                          "fromPort": perm.get("fromPort"),
                                          "toPort": perm.get("toPort")})
                sg_ingress[sg_id] = rules

        for ec2_arn, ec2_node in by_service.get("ec2", []):
            ec2_sgs = set(get_metrics(ec2_node).get("securityGroupIds", []))
            if not ec2_sgs:
                continue
            for rds_arn, rds_node in by_service.get("rds", []):
                rds_vpc_sgs = rds_node.get("data", {}).get("VpcSecurityGroups", [])
                rds_sg_ids = [sg.get("VpcSecurityGroupId") for sg in rds_vpc_sgs if sg.get("VpcSecurityGroupId")]
                for rds_sg in rds_sg_ids:
                    if any(r.get("sourceGroup") in ec2_sgs for r in sg_ingress.get(rds_sg, [])):
                        make_edge(ec2_arn, rds_arn, "writes_to", 70, ["security_group_rule"])
                        break

        # ── Merge DB relationships (if any exist from previous scans) ─────────
        relationships = db.query(Relationship).filter(
            Relationship.snapshot_id == latest_snapshot.id
        ).all()
        for rel in relationships:
            try:
                make_edge(
                    rel.source_arn, rel.target_arn,
                    rel.label or "", rel.confidence or 80,
                    rel.evidence or ["db_relationship"],
                    edge_id=rel.edge_id
                )
            except Exception as e:
                logger.error(f"Failed to merge DB edge: {str(e)}")
                continue

        logger.info(f"Returning {len(nodes)} nodes and {len(edges)} edges (dynamic + db)")

        return NormalizeAccountResponse(
            success=True,
            message=f"Successfully normalized snapshot v{latest_snapshot.version_number}",
            account_name=account.account_name,
            snapshot_version=latest_snapshot.version_number,
            total_resources=len(nodes),
            nodes=nodes,
            edges=edges
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Account normalization error: {str(e)}")
        raise HTTPException(
            status_code=400,
            detail=f"Normalization error: {str(e)}"
        )


# ─────────────────────────────────────────
# HEALTH CHECK
# ─────────────────────────────────────────

@router.get("/health")
def normalize_health():
    """Check if normalization service is ready"""
    return {
        "status": "ready",
        "message": "Normalization service fetches latest snapshots and normalizes data from database"
    }
