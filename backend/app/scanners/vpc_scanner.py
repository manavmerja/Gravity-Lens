import boto3
import logging
from botocore.exceptions import ClientError
from typing import Optional
from app.engines.normalizer import normalizer

logger = logging.getLogger(__name__)


class VPCScanner:

    def scan(
        self,
        credentials: dict,
        region: str,
        account_id: str
    ) -> dict:
        """
        Scan all VPCs and Subnets in a region.
        Returns nodes and edges in React Flow format.
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

            # ── Scan VPCs ──────────────────────────
            vpc_map = {}  # vpc_id → vpc_arn

            paginator = ec2.get_paginator('describe_vpcs')
            for page in paginator.paginate():
                for vpc in page['Vpcs']:
                    try:
                        result = normalizer.normalize_vpc(
                            vpc, region, account_id
                        )
                        nodes.append(result)
                        vpc_map[result['raw_id']] = result['resource_arn']
                        logger.info(f"VPC scanned: {result['raw_id']}")
                    except Exception as e:
                        errors.append(f"VPC error: {str(e)}")

            # ── Scan Subnets ────────────────────────
            paginator = ec2.get_paginator('describe_subnets')
            for page in paginator.paginate():
                for subnet in page['Subnets']:
                    try:
                        vpc_id = subnet['VpcId']
                        vpc_arn = vpc_map.get(vpc_id)

                        result = normalizer.normalize_subnet(
                            subnet, region, account_id,
                            vpc_arn=vpc_arn
                        )
                        nodes.append(result)

                        # Create edge: VPC → Subnet
                        if vpc_arn:
                            edge = normalizer.build_edge(
                                source_arn=vpc_arn,
                                target_arn=result['resource_arn'],
                                label="contains"
                            )
                            edges.append(edge)

                        logger.info(f"Subnet scanned: {result['raw_id']}")
                    except Exception as e:
                        errors.append(f"Subnet error: {str(e)}")

        except ClientError as e:
            errors.append(f"AWS ClientError: {str(e)}")
        except Exception as e:
            errors.append(f"Scanner error: {str(e)}")

        return {
            "nodes": nodes,
            "edges": edges,
            "errors": errors,
            "service": "vpc+subnet",
            "region": region
        }


vpc_scanner = VPCScanner()