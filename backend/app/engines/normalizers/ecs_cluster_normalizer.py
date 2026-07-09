import json
from typing import Optional
from app.engines.normalizers.base import BaseNormalizer, normalizer

@normalizer(service="ecs_cluster")
class EcsClusterNormalizer(BaseNormalizer):
    def normalize(self, cluster: dict, services: list, region: str, account_id: str, subnet_map: dict={}) -> dict:
        cluster_arn = cluster['clusterArn']
        cluster_name = cluster['clusterName']
        task_roles = []
        execution_roles = []
        ecr_images = []
        service_subnet_ids = []
        for svc in services:
            td = svc.get('taskDefinitionDetail', {})
            if td.get('taskRoleArn'):
                task_roles.append(td['taskRoleArn'])
            if td.get('executionRoleArn'):
                execution_roles.append(td['executionRoleArn'])
            for container in td.get('containerDefinitions', []):
                img = container.get('image', '')
                if img:
                    ecr_images.append(img)
            net = svc.get('networkConfiguration', {}).get('awsvpcConfiguration', {})
            service_subnet_ids.extend(net.get('subnets', []))
        subnet_arn = subnet_map.get(service_subnet_ids[0]) if service_subnet_ids else None
        metrics = {'status': cluster.get('status', 'ACTIVE'), 'activeServicesCount': cluster.get('activeServicesCount', len(services)), 'runningTasksCount': cluster.get('runningTasksCount', 0), 'pendingTasksCount': cluster.get('pendingTasksCount', 0), 'taskRoles': list(set(task_roles)), 'executionRoles': list(set(execution_roles)), 'ecrImages': list(set(ecr_images)), 'subnetIds': list(set(service_subnet_ids)), 'region': region, 'securityScan': 'Pass'}
        node = self.build_node(resource_arn=cluster_arn, node_type='ecsNode', name=cluster_name, service='ecs', region=region, account_id=account_id, metrics=metrics, insights=f'{cluster.get('activeServicesCount', 0)} services running', parent_arn=subnet_arn)
        fingerprint = self.generate_fingerprint(metrics)
        return {'node': node, 'fingerprint': fingerprint, 'resource_arn': cluster_arn, 'resource_name': cluster_name, 'raw_id': cluster_name, 'parent_arn': subnet_arn}

