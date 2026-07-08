import boto3
import logging
from app.scanners.base import BaseScanner, scanner
from app.engines.normalizer import normalizer

logger = logging.getLogger(__name__)


@scanner(service="rds", scope="regional", priority=100)
class RDSScanner(BaseScanner):

    def scan(self, credentials: dict, region: str = None, aws_account_id: str = None, subnet_map: dict = None, **kwargs) -> dict:
        account_id = aws_account_id
        nodes = []
        edges = []
        errors = []

        try:
            rds = boto3.client(
                'rds',
                region_name=region,
                aws_access_key_id=credentials['AccessKeyId'],
                aws_secret_access_key=credentials['SecretAccessKey'],
                aws_session_token=credentials['SessionToken']
            )

            paginator = rds.get_paginator('describe_db_instances')
            for page in paginator.paginate():
                for db in page['DBInstances']:
                    try:
                        # Get subnet for parent
                        subnet_group = db.get('DBSubnetGroup', {})
                        subnets = subnet_group.get('Subnets', [])
                        subnet_arn = None
                        if subnets:
                            sid = subnets[0].get('SubnetIdentifier')
                            subnet_arn = subnet_map.get(sid)

                        result = normalizer.normalize_rds(
                            db_instance=db,
                            region=region,
                            account_id=account_id,
                            subnet_arn=subnet_arn
                        )
                        nodes.append(result)

                        if subnet_arn:
                            edge = normalizer.build_edge(
                                source_arn=subnet_arn,
                                target_arn=result['resource_arn'],
                                label="hosts"
                            )
                            edges.append(edge)

                        logger.info(f"RDS scanned: {db['DBInstanceIdentifier']}")

                    except Exception as e:
                        errors.append(f"RDS error: {str(e)}")

        except Exception as e:
            errors.append(f"RDS scanner error: {str(e)}")

        return {
            "nodes": nodes,
            "edges": edges,
            "errors": errors,
            "service": "rds",
            "region": region
        }


