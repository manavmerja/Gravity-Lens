import json
from typing import Optional
from app.engines.normalizers.base import BaseNormalizer, normalizer

@normalizer(service="apigateway")
class ApigatewayNormalizer(BaseNormalizer):
    def normalize(self, api: dict, region: str, account_id: str) -> dict:
        """
            Convert raw AWS API Gateway response into standard node format.
            API Gateway has no parent.
            """
        api_id = api.get('id') or api.get('ApiId')
        api_name = api.get('name') or api.get('Name', api_id)
        resource_arn = f'arn:aws:apigateway:{region}::/restapis/{api_id}'
        protocol = api.get('ProtocolType', 'REST')
        metrics = {'type': protocol, 'apiId': api_id, 'endpointType': api.get('EndpointConfiguration', {}).get('Types', ['REGIONAL'])[0] if 'EndpointConfiguration' in api else 'HTTP', 'region': region, 'securityScan': 'Pass', 'integrations': api.get('Integrations', [])}
        insights = f'{protocol} API'
        node = self.build_node(resource_arn=resource_arn, node_type='apiGatewayNode', name=api_name, service='apigateway', region=region, account_id=account_id, metrics=metrics, insights=insights)
        fingerprint = self.generate_fingerprint(metrics)
        return {'node': node, 'fingerprint': fingerprint, 'resource_arn': resource_arn, 'resource_name': api_name, 'raw_id': api_id}

