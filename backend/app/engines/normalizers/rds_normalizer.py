import json
from typing import Optional
from app.engines.normalizers.base import BaseNormalizer, normalizer

@normalizer(service="rds")
class RdsNormalizer(BaseNormalizer):
    def normalize(self, db_instance: dict, region: str, account_id: str, subnet_arn: Optional[str]=None) -> dict:
        """
            Convert raw AWS RDS response into standard node format.
            Parent is Subnet if inside VPC.
            """
        db_id = db_instance['DBInstanceIdentifier']
        resource_arn = db_instance.get('DBInstanceArn', f'arn:aws:rds:{region}:{account_id}:db:{db_id}')
        engine = db_instance.get('Engine', 'N/A')
        engine_version = db_instance.get('EngineVersion', '')
        status = db_instance.get('DBInstanceStatus', 'N/A')
        metrics = {'engine': f'{engine} {engine_version}', 'instanceClass': db_instance.get('DBInstanceClass', 'N/A'), 'storage': f'{db_instance.get('AllocatedStorage', 0)} GB', 'status': status, 'multiAZ': db_instance.get('MultiAZ', False), 'region': region, 'securityScan': self._scan_rds(db_instance), 'dbSubnetGroupVpcId': db_instance.get('DBSubnetGroup', {}).get('VpcId', '')}
        insights = f'{status.capitalize()} - {engine}'
        node = self.build_node(resource_arn=resource_arn, node_type='rdsNode', name=db_id, service='rds', region=region, account_id=account_id, metrics=metrics, insights=insights, parent_arn=subnet_arn)
        fingerprint = self.generate_fingerprint(metrics)
        return {'node': node, 'fingerprint': fingerprint, 'resource_arn': resource_arn, 'resource_name': db_id, 'raw_id': db_id, 'parent_arn': subnet_arn}

