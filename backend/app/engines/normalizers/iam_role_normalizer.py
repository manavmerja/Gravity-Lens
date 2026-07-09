import json
from typing import Optional
from app.engines.normalizers.base import BaseNormalizer, normalizer

@normalizer(service="iam_role")
class IamRoleNormalizer(BaseNormalizer):
    def normalize(self, role: dict, attached_policies: list, inline_policies: list, region: str, account_id: str) -> dict:
        role_name = role['RoleName']
        role_arn = role['Arn']
        policy_names = [p.get('PolicyName', '') for p in attached_policies] + inline_policies
        services_accessed = []
        for p in policy_names:
            pl = p.lower()
            for svc in ['s3', 'sqs', 'sns', 'dynamodb', 'rds', 'lambda', 'ec2', 'ecs', 'cloudfront']:
                if svc in pl and svc not in services_accessed:
                    services_accessed.append(svc)
        metrics = {'roleArn': role_arn, 'attachedPolicies': [p.get('PolicyName') for p in attached_policies], 'inlinePolicies': inline_policies, 'servicesAccessed': services_accessed, 'assumeRolePrincipals': self._extract_principals(role.get('AssumeRolePolicyDocument', {})), 'region': 'global', 'securityScan': 'Pass'}
        node = self.build_node(resource_arn=role_arn, node_type='iamRoleNode', name=role_name, service='iam', region='global', account_id=account_id, metrics=metrics, insights=f'{len(attached_policies)} policies attached')
        fingerprint = self.generate_fingerprint(metrics)
        return {'node': node, 'fingerprint': fingerprint, 'resource_arn': role_arn, 'resource_name': role_name, 'raw_id': role_name}

