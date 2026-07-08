import boto3
import json
import logging
from botocore.config import Config
from app.scanners.base import BaseScanner, scanner
from app.engines.normalizer import normalizer

logger = logging.getLogger(__name__)

retry_config = Config(
    retries={
        'max_attempts': 10,
        'mode': 'adaptive'
    }
)

@scanner(service="stepfunctions", scope="regional", priority=150)
class StepfunctionsScanner(BaseScanner):
    
    def _get_boto(self, service, region, creds):
        return boto3.client(
            service, region_name=region,
            aws_access_key_id=creds['AccessKeyId'],
            aws_secret_access_key=creds['SecretAccessKey'],
            aws_session_token=creds['SessionToken'],
            config=retry_config
        )

    def scan(self, credentials: dict, region: str = None, aws_account_id: str = None, subnet_map: dict = None, **kwargs) -> dict:
        account_id = aws_account_id

        nodes, edges, errors = [], [], []
        try:
            sfn = self._get_boto('stepfunctions', region, credentials)
            
            sms = []
            paginator = sfn.get_paginator('list_state_machines')
            for page in paginator.paginate():
                sms.extend(page.get('stateMachines', []))
                
            for sm in sms:
                arn = sm['stateMachineArn']
                detail = sfn.describe_state_machine(stateMachineArn=arn)
                nodes.append(normalizer.normalize_stepfunctions(detail, region, account_id))
        except Exception as e:
            errors.append(str(e))
        return {"nodes": nodes, "edges": edges, "errors": errors}

