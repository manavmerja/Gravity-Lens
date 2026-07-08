import logging
from app.engines.normalizers.base import BaseNormalizer, normalizer

logger = logging.getLogger(__name__)

@normalizer(service="sns_endpoints")
class SnsEndpointsNormalizer(BaseNormalizer):
    def normalize(self, topic_arn, endpoints, region, account_id) -> dict:
        """Pass 2 variant — used by pass2_scanners. Stores pre-grouped endpoints dict."""
        topic_name = topic_arn.split(":")[-1]
        metrics = {"endpoints": endpoints, "region": region}
        node = self.build_node(topic_arn, "snsNode", topic_name, "sns", region, account_id, metrics)
        return {"node": node, "resource_arn": topic_arn, "resource_name": topic_name, "raw_id": topic_arn}

