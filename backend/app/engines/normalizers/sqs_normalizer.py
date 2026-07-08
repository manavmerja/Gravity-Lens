import json
from typing import Optional
from app.engines.normalizers.base import BaseNormalizer, normalizer

@normalizer(service="sqs")
class SqsNormalizer(BaseNormalizer):
    def normalize(self, queue_url: str, attributes: dict, region: str, account_id: str) -> dict:
        """
            Convert raw AWS SQS response into standard node format.
            SQS has no parent (not inside VPC).
            """
        queue_name = queue_url.split('/')[-1]
        resource_arn = attributes.get('QueueArn', f'arn:aws:sqs:{region}:{account_id}:{queue_name}')
        is_fifo = queue_name.endswith('.fifo')
        is_encrypted = 'SqsManagedSseEnabled' in attributes
        metrics = {'type': 'FIFO' if is_fifo else 'Standard', 'visibilityTimeout': f'{attributes.get('VisibilityTimeout', 30)}s', 'messageRetention': f'{int(attributes.get('MessageRetentionPeriod', 345600)) // 86400} days', 'encrypted': is_encrypted, 'region': region, 'securityScan': 'Pass: Encrypted' if is_encrypted else 'Warning: Not encrypted'}
        insights = 'FIFO Queue' if is_fifo else 'Standard Queue'
        node = self.build_node(resource_arn=resource_arn, node_type='sqsNode', name=queue_name, service='sqs', region=region, account_id=account_id, metrics=metrics, insights=insights)
        fingerprint = self.generate_fingerprint(metrics)
        return {'node': node, 'fingerprint': fingerprint, 'resource_arn': resource_arn, 'resource_name': queue_name, 'raw_id': queue_name}

