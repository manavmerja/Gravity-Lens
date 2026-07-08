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

@scanner(service="secretsmanager", scope="regional", priority=150)
class SecretsmanagerScanner(BaseScanner):
    
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
            sm = self._get_boto('secretsmanager', region, credentials)
            
            secrets = []
            paginator = sm.get_paginator('list_secrets')
            for page in paginator.paginate():
                secrets.extend(page.get('SecretList', []))
                
            for secret in secrets:
                nodes.append(normalizer.normalize_secretsmanager(secret, region, account_id))
        except Exception as e:
            errors.append(str(e))
        return {"nodes": nodes, "edges": edges, "errors": errors}

