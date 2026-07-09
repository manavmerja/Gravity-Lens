import json
from typing import Optional
from app.engines.normalizers.base import BaseNormalizer, normalizer

@normalizer(service="cloudfront")
class CloudfrontNormalizer(BaseNormalizer):
    def normalize(self, distribution: dict, account_id: str) -> dict:
        dist_id = distribution['Id']
        domain = distribution.get('DomainName', '')
        resource_arn = distribution.get('ARN', f'arn:aws:cloudfront::{account_id}:distribution/{dist_id}')
        status = distribution.get('Status', 'Deployed')
        origins = distribution.get('Origins', {}).get('Items', [])
        origin_domains = [o.get('DomainName', '') for o in origins]
        s3_origins = [d for d in origin_domains if '.s3.' in d or d.endswith('.s3.amazonaws.com')]
        s3_bucket_names = [d.split('.s3.')[0] for d in s3_origins]
        is_https_only = distribution.get('DefaultCacheBehavior', {}).get('ViewerProtocolPolicy') == 'https-only'
        metrics = {'domainName': domain, 'status': status, 'enabled': distribution.get('Enabled', True), 'originDomains': origin_domains, 's3BucketNames': s3_bucket_names, 'httpsOnly': is_https_only, 'region': 'global', 'securityScan': 'Pass' if is_https_only else 'Warning: HTTPS not enforced'}
        node = self.build_node(resource_arn=resource_arn, node_type='cloudfrontNode', name=domain or dist_id, service='cloudfront', region='global', account_id=account_id, metrics=metrics, insights=f'{status} - {('HTTPS only' if is_https_only else 'HTTP allowed')}')
        fingerprint = self.generate_fingerprint(metrics)
        return {'node': node, 'fingerprint': fingerprint, 'resource_arn': resource_arn, 'resource_name': domain or dist_id, 'raw_id': dist_id}

