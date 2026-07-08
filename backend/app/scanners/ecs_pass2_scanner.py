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

@scanner(service="ecs_pass2", scope="regional", priority=150)
class EcsPass2Scanner(BaseScanner):

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
            ecs = self._get_boto('ecs', region, credentials)

            clusters = []
            clusters_paginator = ecs.get_paginator('list_clusters')
            for page in clusters_paginator.paginate():
                clusters.extend(page.get('clusterArns', []))

            unique_task_defs = set()
            for cluster in clusters:
                tasks = []
                tasks_paginator = ecs.get_paginator('list_tasks')
                for page in tasks_paginator.paginate(cluster=cluster):
                    tasks.extend(page.get('taskArns', []))

                if tasks:
                    for i in range(0, len(tasks), 100):
                        chunk = tasks[i:i+100]
                        task_details = ecs.describe_tasks(cluster=cluster, tasks=chunk).get('tasks', [])
                        for t in task_details:
                            unique_task_defs.add(t['taskDefinitionArn'])

            for td_arn in unique_task_defs:
                try:
                    td = ecs.describe_task_definition(taskDefinition=td_arn).get('taskDefinition', {})
                    nodes.append(normalizer.normalize_ecs(td, region, account_id))
                except Exception:
                    pass
        except Exception as e:
            errors.append(str(e))
        return {"nodes": nodes, "edges": edges, "errors": errors}

