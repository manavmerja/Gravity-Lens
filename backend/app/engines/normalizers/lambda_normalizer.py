import json
from typing import Optional
from app.engines.normalizers.base import BaseNormalizer, normalizer

@normalizer(service="lambda")
class LambdaNormalizer(BaseNormalizer):
    def normalize(self, function: dict, region: str, account_id: str, subnet_arn: Optional[str]=None) -> dict:
        """
            Convert raw AWS Lambda response into standard node format.
            Parent is Subnet if Lambda is inside VPC.
            """
        function_name = function['FunctionName']
        resource_arn = function.get('FunctionArn', f'arn:aws:lambda:{region}:{account_id}:function:{function_name}')
        vpc_config = function.get('VpcConfig', {})
        subnet_ids = vpc_config.get('SubnetIds', [])
        security_group_ids = vpc_config.get('SecurityGroupIds', [])
        vpc_id = vpc_config.get('VpcId', '')
        in_vpc = len(subnet_ids) > 0
        metrics = {'runtime': function.get('Runtime', 'N/A'), 'memory': f'{function.get('MemorySize', 128)} MB', 'timeout': f'{function.get('Timeout', 3)}s', 'iamRole': function.get('Role', 'N/A').split('/')[-1], 'roleArn': function.get('Role', 'N/A'), 'inVpc': in_vpc, 'vpcId': vpc_id, 'subnetIds': subnet_ids, 'securityGroupIds': security_group_ids, 'region': region, 'securityScan': 'Pass' if in_vpc else 'Warning: Lambda not in VPC', 'environment': function.get('Environment', {}), 'eventSourceMappings': function.get('EventSourceMappings', []), 'functionArn': resource_arn}
        insights = 'Inside VPC' if in_vpc else 'Public Lambda'
        node = self.build_node(resource_arn=resource_arn, node_type='lambdaNode', name=function_name, service='lambda', region=region, account_id=account_id, metrics=metrics, insights=insights, parent_arn=subnet_arn)
        fingerprint = self.generate_fingerprint(metrics)
        return {'node': node, 'fingerprint': fingerprint, 'resource_arn': resource_arn, 'resource_name': function_name, 'raw_id': function_name, 'parent_arn': subnet_arn}

