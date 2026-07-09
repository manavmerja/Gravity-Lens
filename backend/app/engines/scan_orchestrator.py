import logging
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.models import ScanJob, ServiceScan, ScanStatus, AwsAccount
from app.services.aws_service import aws_service
from app.engines.snapshot_engine import snapshot_engine
from app.engines.relationship_engine import relationship_engine
from app.database import SessionLocal
from uuid import UUID
from app.scanners.base import discover_scanners, get_scanners

logger = logging.getLogger(__name__)

# Regions to scan — add more later
SCAN_REGIONS = ['ap-south-1', 'us-east-1']

class ScanOrchestrator:
    def __init__(self):
        # Auto-discover scanners when the orchestrator starts
        discover_scanners()

    def run_scan(self, scan_job_id: UUID):
        """
        Main entry point for running a full scan.
        Called by scheduler.
        """
        db = SessionLocal()
        try:
            scan_job = db.query(ScanJob).filter(
                ScanJob.id == scan_job_id
            ).first()

            if not scan_job:
                logger.error(f"Scan job {scan_job_id} not found")
                return

            scan_job.status = ScanStatus.running
            scan_job.started_at = datetime.utcnow()
            db.commit()

            aws_account = db.query(AwsAccount).filter(
                AwsAccount.id == scan_job.account_id
            ).first()

            if not aws_account:
                scan_job.status = ScanStatus.failed
                scan_job.error_message = "AWS account not found"
                db.commit()
                return

            credentials = aws_service._get_temp_credentials(aws_account.role_arn)
            if not credentials:
                scan_job.status = ScanStatus.failed
                scan_job.error_message = "Failed to get AWS credentials"
                db.commit()
                return

            aws_account_id = aws_account.account_id
            all_nodes = []
            all_edges = []
            any_failure = False

            # Retrieve registered scanners
            regional_scanners = get_scanners(scope="regional")
            global_scanners = get_scanners(scope="global")

            # ── Scan each region ──────────────────────────────────────────────
            for region in SCAN_REGIONS:
                logger.info(f"Scanning region: {region}")

                subnet_map = {}  # subnet_id -> subnet_arn

                for service_name, scanner_instance in regional_scanners:
                    try:
                        logger.info(f"Running regional scanner: {service_name} in {region}")
                        result = scanner_instance.scan(
                            credentials=credentials,
                            region=region,
                            aws_account_id=aws_account_id,
                            subnet_map=subnet_map
                        )
                        
                        nodes = result.get('nodes', [])
                        edges = result.get('edges', [])
                        
                        all_nodes.extend(nodes)
                        all_edges.extend(edges)
                        
                        # Special handling for subnet map (needed by other regional scanners)
                        if service_name == 'vpc':
                            for node_result in nodes:
                                if node_result.get('node', {}).get('data', {}).get('service') == 'subnet':
                                    subnet_map[node_result.get('raw_id')] = node_result.get('resource_arn')
                                    
                        self._save_service_scan(db, scan_job.id, service_name, region, ScanStatus.success, len(nodes))
                    except Exception as e:
                        logger.error(f"Error in scanner {service_name} for region {region}: {e}")
                        any_failure = True
                        self._save_service_scan(db, scan_job.id, service_name, region, ScanStatus.failed, 0, str(e))

            # ── Scan global services ───────────────────────────────────────────
            for service_name, scanner_instance in global_scanners:
                try:
                    logger.info(f"Running global scanner: {service_name}")
                    result = scanner_instance.scan(
                        credentials=credentials,
                        region="global", # Some global scanners might not care, but pass something
                        aws_account_id=aws_account_id
                    )
                    
                    nodes = result.get('nodes', [])
                    edges = result.get('edges', [])
                    
                    all_nodes.extend(nodes)
                    all_edges.extend(edges)
                    self._save_service_scan(db, scan_job.id, service_name, 'global', ScanStatus.success, len(nodes))
                except Exception as e:
                    logger.error(f"Error in global scanner {service_name}: {e}")
                    any_failure = True
                    self._save_service_scan(db, scan_job.id, service_name, 'global', ScanStatus.failed, 0, str(e))

            # ── Discover Relationships (Edges) ────
            if all_nodes:
                try:
                    logger.info("Running Relationship Engine to discover resource connections...")
                    discovered_edges = relationship_engine.discover_relationships(
                        credentials=credentials,
                        region_list=SCAN_REGIONS,
                        nodes=all_nodes
                    )
                    all_edges.extend(discovered_edges)
                    logger.info(f"Relationship Engine discovered {len(discovered_edges)} communication edges.")
                except Exception as rel_err:
                    logger.error(f"Error executing Relationship Engine: {str(rel_err)}")

            # ── Create Snapshot ───────────────────────────────────────────────
            if all_nodes:
                snapshot_engine.create_snapshot(
                    db=db,
                    account_db_id=aws_account.id,
                    all_nodes=all_nodes,
                    all_edges=all_edges,
                    aws_account_id=aws_account_id
                )

            scan_job.status = ScanStatus.partial if any_failure else ScanStatus.success
            scan_job.completed_at = datetime.utcnow()
            db.commit()

            logger.info(
                f"Scan complete. "
                f"Resources: {len(all_nodes)}, "
                f"Edges: {len(all_edges)}, "
                f"Status: {scan_job.status}"
            )

        except Exception as e:
            logger.error(f"Scan orchestrator error: {str(e)}")
            if scan_job:
                scan_job.status = ScanStatus.failed
                scan_job.error_message = str(e)
                scan_job.completed_at = datetime.utcnow()
                db.commit()
        finally:
            db.close()

    def _save_service_scan(self, db, scan_job_id, service, region, status, count, error=None):
        from datetime import datetime
        service_scan = ServiceScan(
            scan_job_id=scan_job_id,
            service=service,
            region=region,
            status=status,
            resources_found=count,
            error_message=error,
            started_at=datetime.utcnow(),
            completed_at=datetime.utcnow()
        )
        db.add(service_scan)
        db.commit()


scan_orchestrator = ScanOrchestrator()
