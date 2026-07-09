import json
from typing import Optional
from app.engines.normalizers.base import BaseNormalizer, normalizer

@normalizer(service="ec2")
class Ec2Normalizer(BaseNormalizer):
    def normalize(self, instance: dict, region: str, account_id: str, subnet_map: dict={}) -> dict:
        """
            Convert raw AWS EC2 instance into standard node format.
            Parent is Subnet if instance is inside a VPC.
            """
        instance_id = instance['InstanceId']
        resource_arn = f'arn:aws:ec2:{region}:{account_id}:instance/{instance_id}'
        name = self._get_tag(instance, 'Name') or instance_id
        subnet_id = instance.get('SubnetId')
        subnet_arn = subnet_map.get(subnet_id) if subnet_id else None
        public_ip = instance.get('PublicIpAddress', 'None')
        private_ip = instance.get('PrivateIpAddress', 'None')
        state = instance.get('State', {}).get('Name', 'unknown')
        security_groups = [sg.get('GroupName', '') for sg in instance.get('SecurityGroups', [])]
        security_group_ids = [sg.get('GroupId', '') for sg in instance.get('SecurityGroups', [])]
        iam_profile = instance.get('IamInstanceProfile', {})
        iam_profile_arn = iam_profile.get('Arn', '')
        metrics = {'instanceType': instance.get('InstanceType', 'N/A'), 'state': state, 'privateIp': private_ip, 'publicIp': public_ip, 'securityGroups': security_groups, 'securityGroupIds': security_group_ids, 'vpcId': instance.get('VpcId', ''), 'subnetId': subnet_id or '', 'iamInstanceProfileArn': iam_profile_arn, 'availabilityZone': instance.get('Placement', {}).get('AvailabilityZone', 'N/A'), 'region': region, 'securityScan': self._scan_ec2(instance)}
        insights = f'{state.capitalize()} - {instance.get('InstanceType', 'N/A')}'
        node = self.build_node(resource_arn=resource_arn, node_type='ec2Node', name=name, service='ec2', region=region, account_id=account_id, metrics=metrics, insights=insights, parent_arn=subnet_arn)
        fingerprint = self.generate_fingerprint(metrics)
        return {'node': node, 'fingerprint': fingerprint, 'resource_arn': resource_arn, 'resource_name': name, 'raw_id': instance_id, 'parent_arn': subnet_arn}

