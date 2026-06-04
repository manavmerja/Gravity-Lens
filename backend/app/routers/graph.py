from fastapi import APIRouter
from app.database import SessionLocal
from app.models.models import Snapshot, Resource, Relationship

router = APIRouter(prefix="/api/graph", tags=["Graph"])


@router.get("/latest")
def get_latest_graph():
    db = SessionLocal()
    try:
        snapshot = db.query(Snapshot).filter(
            Snapshot.is_latest == True
        ).order_by(Snapshot.created_at.desc()).first()

        if not snapshot:
            return {"nodes": [], "edges": []}

        resources = db.query(Resource).filter(
            Resource.snapshot_id == snapshot.id
        ).all()

        relationships = db.query(Relationship).filter(
            Relationship.snapshot_id == snapshot.id
        ).all()

        nodes = []
        for r in resources:
            meta = r.meta_data or {}

            nodes.append({
                "id": r.node_id,
                "type": r.node_type,
                "parentId": r.parent_node_id,
                "position": {"x": 0, "y": 0},
                "data": {
                    "name": r.resource_name,
                    "insights": meta.get("insights"),
                    "metrics": meta.get("metrics", {}),
                    "service": r.service,
                    "region": r.region,
                    "accountId": r.account_id,
                    "arn": r.resource_arn
                }
            })

        edges = []
        for rel in relationships:
            edges.append({
                "id": rel.edge_id,
                "source": rel.source_arn,
                "target": rel.target_arn,
                "type": rel.edge_type,
                "label": rel.label
            })

        return {
            "nodes": nodes,
            "edges": edges
        }

    finally:
        db.close()