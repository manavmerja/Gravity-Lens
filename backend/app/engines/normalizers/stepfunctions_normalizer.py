import logging
from app.engines.normalizers.base import BaseNormalizer, normalizer

logger = logging.getLogger(__name__)

@normalizer(service="stepfunctions")
class StepfunctionsNormalizer(BaseNormalizer):
    def normalize(self, detail, region, account_id) -> dict:
        arn = detail['stateMachineArn']
        name = detail['name']
        try:
            states = json.loads(detail.get('definition', '{}')).get('States', {})
        except:
            states = {}
        metrics = {"states": states, "region": region}
        node = self.build_node(arn, "stepFunctionsNode", name, "stepfunctions", region, account_id, metrics)
        return {"node": node, "resource_arn": arn, "resource_name": name, "raw_id": arn}

