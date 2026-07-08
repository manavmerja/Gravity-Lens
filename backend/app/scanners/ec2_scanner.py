import boto3
import logging
from app.scanners.base import BaseScanner, scanner
from botocore.exceptions import ClientError
from app.engines.normalizer import normalizer

logger = logging.getLogger(__name__)


@scanner(service="ec2", scope="regional", priority=100)
class EC2Scanner(BaseScanner):

    def scan(self, credentials: dict, region: str = None, aws_account_id: str = None, subnet_map: dict = None, **kwargs) -> dict:
        account_id = aws_account_id
        """
        Scan all EC2 instances in a region.
        subnet_map: subnet_id → subnet_arn (for parent linking)

        Note: We scan ALL states (running, stopped, etc)
        so version history shows when instances are stopped/started.
        """
        nodes = []
        edges = []
        errors = []

        try:
            ec2 = boto3.client(
                'ec2',
                region_name=region,
                aws_access_key_id=credentials['AccessKeyId'],
                aws_secret_access_key=credentials['SecretAccessKey'],
                aws_session_token=credentials['SessionToken']
            )

            # Paginate through all instances
            # We get ALL states — running, stopped, pending
            # This way version history is accurate
            paginator = ec2.get_paginator('describe_instances')

            for page in paginator.paginate():
                for reservation in page['Reservations']:
                    for instance in reservation['Instances']:

                        # Skip terminated instances
                        # They are gone forever — no point tracking
                        state = instance.get('State', {}).get('Name', '')
                        if state == 'terminated':
                            continue

                        try:
                            result = normalizer.normalize_ec2(
                                instance=instance,
                                region=region,
                                account_id=account_id,
                                subnet_map=subnet_map
                            )
                            nodes.append(result)

                            # Edge: Subnet → EC2
                            if result.get('parent_arn'):
                                edge = normalizer.build_edge(
                                    source_arn=result['parent_arn'],
                                    target_arn=result['resource_arn'],
                                    label="hosts"
                                )
                                edges.append(edge)

                            logger.info(
                                f"EC2 scanned: {result['raw_id']} "
                                f"({state}) in {region}"
                            )

                        except Exception as e:
                            errors.append(
                                f"EC2 instance error {instance.get('InstanceId')}: {str(e)}"
                            )

        except ClientError as e:
            errors.append(f"EC2 ClientError in {region}: {str(e)}")
        except Exception as e:
            errors.append(f"EC2 scanner error in {region}: {str(e)}")

        logger.info(
            f"EC2 scan complete — Region: {region} | "
            f"Found: {len(nodes)} | Errors: {len(errors)}"
        )

        return {
            "nodes": nodes,
            "edges": edges,
            "errors": errors,
            "service": "ec2",
            "region": region
        }


