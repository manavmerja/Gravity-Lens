import json
from typing import Optional
from app.engines.normalizers.base import BaseNormalizer, normalizer

@normalizer(service="s3")
class S3Normalizer(BaseNormalizer):
    def normalize(self, bucket: dict, account_id: str, location: str='us-east-1', public_access: dict={}, versioning: str='Disabled', notification_config: dict=None) -> dict:
        """
            Convert raw AWS S3 bucket into standard node format.
            S3 has no parent (not inside VPC).
            """
        bucket_name = bucket['Name']
        resource_arn = f'arn:aws:s3:::{bucket_name}'
        region = location
        is_public_blocked = public_access.get('BlockPublicAcls', False)
        metrics = {'versioning': versioning, 'publicAccess': 'Blocked' if is_public_blocked else 'Open', 'creationDate': str(bucket.get('CreationDate', 'N/A')), 'region': region, 'securityScan': 'Pass: Block Public Access enabled' if is_public_blocked else 'Warning: Public access may be open', 'bucketArn': resource_arn, 'notificationConfiguration': notification_config or {}}
        insights = 'Public Access Blocked' if is_public_blocked else 'Warning: Check Access'
        node = self.build_node(resource_arn=resource_arn, node_type='s3Node', name=bucket_name, service='s3', region=region, account_id=account_id, metrics=metrics, insights=insights)
        fingerprint = self.generate_fingerprint(metrics)
        return {'node': node, 'fingerprint': fingerprint, 'resource_arn': resource_arn, 'resource_name': bucket_name, 'raw_id': bucket_name}

