import logging
from app.engines.normalizers.base import BaseNormalizer, normalizer

logger = logging.getLogger(__name__)

@normalizer(service="ecs")
class EcsNormalizer(BaseNormalizer):
    def normalize(self, task_def, region, account_id) -> dict:
        arn = task_def['taskDefinitionArn']
        name = task_def.get('family', arn.split('/')[-1])
        secrets = []
        images = []
        logGroup = ""
        for c in task_def.get('containerDefinitions', []):
            secrets.extend(c.get('secrets', []))
            if 'image' in c: images.append(c['image'])
            lg = c.get('logConfiguration', {}).get('options', {}).get('awslogs-group')
            if lg: logGroup = lg
        metrics = {
            "taskRoleArn": task_def.get('taskRoleArn', ''),
            "executionRoleArn": task_def.get('executionRoleArn', ''),
            "secrets": secrets,
            "images": images,
            "logGroup": logGroup,
            "region": region
        }
        node = self.build_node(arn, "ecsNode", name, "ecs", region, account_id, metrics)
        return {"node": node, "resource_arn": arn, "resource_name": name, "raw_id": arn}


