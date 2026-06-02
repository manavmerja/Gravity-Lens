from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import aws_accounts
from app.models.models import ScanJob, ScanStatus
from app.database import SessionLocal
# pyrefly: ignore [missing-import]
from apscheduler.schedulers.background import BackgroundScheduler
import logging

logger = logging.getLogger(__name__)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="GravityLens API",
    description="Cloud Infrastructure Intelligence Platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(aws_accounts.router)


def process_pending_scans():
    """
    Scheduler runs this every 60 seconds.
    Picks up pending scan jobs and runs them.
    """
    from app.engines.scan_orchestrator import scan_orchestrator
    db = SessionLocal()
    try:
        pending_jobs = db.query(ScanJob).filter(
            ScanJob.status == ScanStatus.pending
        ).limit(5).all()

        for job in pending_jobs:
            logger.info(f"Processing scan job: {job.id}")
            scan_orchestrator.run_scan(job.id)

    except Exception as e:
        logger.error(f"Scheduler error: {str(e)}")
    finally:
        db.close()


# Start scheduler
scheduler = BackgroundScheduler()
scheduler.add_job(process_pending_scans, 'interval', seconds=60)
scheduler.start()


@app.get("/")
def health_check():
    return {
        "status": "running",
        "product": "GravityLens API",
        "version": "1.0.0"
    }


@app.post("/api/scan/trigger/{account_id}")
def trigger_manual_scan(account_id: str, db=None):
    """Manually trigger a scan for testing."""
    from app.database import get_db
    from fastapi import Depends
    from app.models.models import AwsAccount
    import uuid

    db = SessionLocal()
    account = db.query(AwsAccount).filter(
        AwsAccount.account_id == account_id
    ).first()

    if not account:
        return {"error": "Account not found"}

    job = ScanJob(
        account_id=account.id,
        status=ScanStatus.pending,
        triggered_by="manual"
    )
    db.add(job)
    db.commit()

    return {"message": "Scan queued", "job_id": str(job.id)}