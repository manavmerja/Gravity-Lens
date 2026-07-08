import json
from typing import Optional
from app.engines.normalizers.base import BaseNormalizer, normalizer

@normalizer(service="subnet")
class SubnetNormalizer(BaseNormalizer):
    def normalize(self, subnet: dict, region: str, account_id: str, vpc_arn: str) -> dict:
        """
            Convert raw AWS Subnet response into standard node format.
            Parent is always the VPC.
            """
        subnet_id = subnet['SubnetId']
        resource_arn = f'arn:aws:ec2:{region}:{account_id}:subnet/{subnet_id}'
        name = self._get_tag(subnet, 'Name') or subnet_id
        is_public = subnet.get('MapPublicIpOnLaunch', False)
        subnet_type = 'Public Subnet' if is_public else 'Private Subnet'
        metrics = {'cidrBlock': subnet.get('CidrBlock', 'N/A'), 'availabilityZone': subnet.get('AvailabilityZone', 'N/A'), 'availableIPs': subnet.get('AvailableIpAddressCount', 0), 'type': subnet_type, 'region': region, 'securityScan': 'Pass' if not is_public else 'Warning: Public subnet'}
        node = self.build_node(resource_arn=resource_arn, node_type='subnetNode', name=name, service='subnet', region=region, account_id=account_id, metrics=metrics, insights=subnet_type, parent_arn=vpc_arn)
        fingerprint = self.generate_fingerprint(metrics)
        return {'node': node, 'fingerprint': fingerprint, 'resource_arn': resource_arn, 'resource_name': name, 'raw_id': subnet_id, 'vpc_id': subnet.get('VpcId'), 'parent_arn': vpc_arn}

