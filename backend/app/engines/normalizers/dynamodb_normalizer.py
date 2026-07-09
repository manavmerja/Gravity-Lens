import json
from typing import Optional
from app.engines.normalizers.base import BaseNormalizer, normalizer

@normalizer(service="dynamodb")
class DynamodbNormalizer(BaseNormalizer):
    def normalize(self, table: dict, region: str, account_id: str) -> dict:
        table_name = table['TableName']
        resource_arn = table.get('TableArn', f'arn:aws:dynamodb:{region}:{account_id}:table/{table_name}')
        status = table.get('TableStatus', 'ACTIVE')
        stream_arn = table.get('LatestStreamArn', '')
        stream_enabled = table.get('StreamSpecification', {}).get('StreamEnabled', False)
        billing = table.get('BillingModeSummary', {}).get('BillingMode', 'PROVISIONED')
        item_count = table.get('ItemCount', 0)
        size_bytes = table.get('TableSizeBytes', 0)
        metrics = {'status': status, 'billingMode': billing, 'itemCount': item_count, 'sizeBytes': size_bytes, 'streamEnabled': stream_enabled, 'streamArn': stream_arn, 'region': region, 'securityScan': 'Pass' if status == 'ACTIVE' else f'Warning: Table status {status}'}
        node = self.build_node(resource_arn=resource_arn, node_type='dynamodbNode', name=table_name, service='dynamodb', region=region, account_id=account_id, metrics=metrics, insights=f'{billing} - {item_count} items')
        fingerprint = self.generate_fingerprint(metrics)
        return {'node': node, 'fingerprint': fingerprint, 'resource_arn': resource_arn, 'resource_name': table_name, 'raw_id': table_name}

