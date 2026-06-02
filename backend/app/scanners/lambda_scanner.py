import boto3
import logging
from botocore.exceptions import ClientError
from app.engines.normalizer import normalizer

logger = logging.getLogger(__name__)


class LambdaScanner:

    def scan(
        self,
        credentials: dict,
        region: str,
        account_id: str,
        subnet_map: dict = {}
    ) -> dict:
        """
        Scan all Lambda functions in a region.
        subnet_map: subnet_id → subnet_arn (for parent linking)
        """
        nodes = []
        edges = []
        errors = []

        try:
            lambda_client = boto3.client(
                'lambda',
                region_name=region,
                aws_access_key_id=credentials['AccessKeyId'],
                aws_secret_access_key=credentials['SecretAccessKey'],
                aws_session_token=credentials['SessionToken']
            )

            paginator = lambda_client.get_paginator('list_functions')
            for page in paginator.paginate():
                for function in page['Functions']:
                    try:
                        # Check if Lambda is in VPC
                        vpc_config = function.get('VpcConfig', {})
                        subnet_ids = vpc_config.get('SubnetIds', [])

                        # Use first subnet as parent
                        subnet_arn = None
                        if subnet_ids:
                            subnet_arn = subnet_map.get(subnet_ids[0])

                        result = normalizer.normalize_lambda(
                            function=function,
                            region=region,
                            account_id=account_id,
                            subnet_arn=subnet_arn
                        )
                        nodes.append(result)

                        # Edge: Subnet → Lambda
                        if subnet_arn:
                            edge = normalizer.build_edge(
                                source_arn=subnet_arn,
                                target_arn=result['resource_arn'],
                                label="hosts"
                            )
                            edges.append(edge)

                        logger.info(f"Lambda scanned: {function['FunctionName']}")

                    except Exception as e:
                        errors.append(f"Lambda error: {str(e)}")

        except Exception as e:
            errors.append(f"Lambda scanner error: {str(e)}")

        return {
            "nodes": nodes,
            "edges": edges,
            "errors": errors,
            "service": "lambda",
            "region": region
        }


lambda_scanner = LambdaScanner()