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
    Returns: Normalized nodes and edges ready for visualization
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
        resources = db.query(Resource).filter(
            Resource.snapshot_id == latest_snapshot.id
        ).all()

        if not resources:
            return NormalizeAccountResponse(
                success=True,
                message=f"Snapshot has no resources",
                account_name=account.account_name,
                snapshot_version=latest_snapshot.version_number,
                total_resources=0,
                nodes=[],
                edges=[]
            )

        logger.info(f"Found {len(resources)} resources in snapshot")

        # Step 4: Normalize each resource
        nodes = []
        arn_to_node = {}  # For edge creation
        vpc_arns = set()

        for resource in resources:
            try:
                # Extract metadata
                metadata = resource.meta_data or {}
                region = resource.region
                service = resource.service
                node_type = resource.node_type

                # Build node from stored data
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
                        "metrics": metadata.get("metrics", {})
                    }
                }

                # Add parent if exists
                if resource.parent_node_id:
                    parent_resource = db.query(Resource).filter(
                        Resource.snapshot_id == latest_snapshot.id,
                        Resource.node_id == resource.parent_node_id
                    ).first()
                    if parent_resource:
                        node["parentID"] = parent_resource.resource_arn

                nodes.append(node)
                arn_to_node[resource.resource_arn] = node

                if service == "vpc":
                    vpc_arns.add(resource.resource_arn)

                logger.info(f"✓ Normalized: {node_type} - {resource.resource_name}")

            except Exception as e:
                logger.error(f"✗ Failed to normalize resource {resource.node_id}: {str(e)}")
                continue

        # Step 5: Fetch and create edges, excluding VPC-related edges
        edges = []
        relationships = db.query(Relationship).filter(
            Relationship.snapshot_id == latest_snapshot.id
        ).all()

        for rel in relationships:
            try:
                if rel.source_arn in vpc_arns or rel.target_arn in vpc_arns:
                    logger.info(f"Skipping VPC edge: {rel.edge_id} ({rel.source_arn} -> {rel.target_arn})")
                    continue

                edge = {
                    "id": rel.edge_id,
                    "source": rel.source_arn,
                    "target": rel.target_arn,
                    "type": "animatedEdge",
                    "label": rel.label
                }
                edges.append(edge)
            except Exception as e:
                logger.error(f"Failed to create edge: {str(e)}")
                continue

        logger.info(f"Created {len(edges)} edges")

        return NormalizeAccountResponse(
            success=True,
            message=f"Successfully normalized snapshot v{latest_snapshot.version_number}",
            account_name=account.account_name,
            snapshot_version=latest_snapshot.version_number,
            total_resources=len(resources),
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
