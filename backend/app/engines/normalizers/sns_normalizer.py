import json
from typing import Optional
from app.engines.normalizers.base import BaseNormalizer, normalizer

@normalizer(service="sns")
class SnsNormalizer(BaseNormalizer):
    def normalize(self, topic_arn: str, attributes: dict, subscriptions: list, region: str, account_id: str) -> dict:
        topic_name = topic_arn.split(':')[-1]
        is_fifo = topic_name.endswith('.fifo')
        is_encrypted = bool(attributes.get('KmsMasterKeyId'))
        subscriber_arns = [s.get('SubscriptionArn', '') for s in subscriptions if s.get('Protocol') in ('lambda', 'sqs')]
        endpoint_arns = [s.get('Endpoint', '') for s in subscriptions if s.get('Protocol') in ('lambda', 'sqs')]
        metrics = {'type': 'FIFO' if is_fifo else 'Standard', 'encrypted': is_encrypted, 'subscriptionsCount': int(attributes.get('SubscriptionsConfirmed', 0)), 'subscriptionEndpoints': endpoint_arns, 'region': region, 'securityScan': 'Pass: Encrypted' if is_encrypted else 'Warning: Not encrypted'}
        node = self.build_node(resource_arn=topic_arn, node_type='snsNode', name=topic_name, service='sns', region=region, account_id=account_id, metrics=metrics, insights='FIFO Topic' if is_fifo else 'Standard Topic')
        fingerprint = self.generate_fingerprint(metrics)
        return {'node': node, 'fingerprint': fingerprint, 'resource_arn': topic_arn, 'resource_name': topic_name, 'raw_id': topic_name}

