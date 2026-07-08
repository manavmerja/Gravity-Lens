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

@scanner(service="eks", scope="regional", priority=150)
class EksScanner(BaseScanner):
    
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
            eks = self._get_boto('eks', region, credentials)
            
            clusters = []
            paginator = eks.get_paginator('list_clusters')
            for page in paginator.paginate():
                clusters.extend(page.get('clusters', []))
                
            for cluster_name in clusters:
                c = eks.describe_cluster(name=cluster_name).get('cluster', {})
                
                ngs = []
                ng_paginator = eks.get_paginator('list_nodegroups')
                for page in ng_paginator.paginate(clusterName=cluster_name):
                    ngs.extend(page.get('nodegroups', []))
                    
                ng_arns = []
                for ng in ngs:
                    ng_detail = eks.describe_nodegroup(clusterName=cluster_name, nodegroupName=ng).get('nodegroup', {})
                    if ng_detail.get('nodegroupArn'):
                        ng_arns.append(ng_detail.get('nodegroupArn'))
                nodes.append(normalizer.normalize_eks(c, ng_arns, region, account_id))
        except Exception as e:
            errors.append(str(e))
        return {"nodes": nodes, "edges": edges, "errors": errors}


