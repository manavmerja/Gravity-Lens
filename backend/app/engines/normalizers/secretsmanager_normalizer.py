import logging
from app.engines.normalizers.base import BaseNormalizer, normalizer

logger = logging.getLogger(__name__)

@normalizer(service="secretsmanager")
class SecretsmanagerNormalizer(BaseNormalizer):
    def normalize(self, secret, region, account_id) -> dict:
        arn = secret['ARN']
        name = secret['Name']
        metrics = {"rotationLambdaARN": secret.get('RotationLambdaARN', ''), "region": region}
        node = self.build_node(arn, "secretsManagerNode", name, "secretsmanager", region, account_id, metrics)
        return {"node": node, "resource_arn": arn, "resource_name": name, "raw_id": arn}

