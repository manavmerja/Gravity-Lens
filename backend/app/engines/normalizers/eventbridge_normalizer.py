import logging
from app.engines.normalizers.base import BaseNormalizer, normalizer

logger = logging.getLogger(__name__)

@normalizer(service="eventbridge")
class EventbridgeNormalizer(BaseNormalizer):
    def normalize(self, rule: dict, region: str, account_id: str) -> dict:
        """
        Convert raw AWS EventBridge rule response into standard node format.
        """
        rule_name = rule['Name']
        resource_arn = rule.get('Arn', f"arn:aws:events:{region}:{account_id}:rule/{rule_name}")

        metrics = {
            "ruleArn": resource_arn,
            "state": rule.get('State', 'ENABLED'),
            "scheduleExpression": rule.get('ScheduleExpression', ''),
            "eventPattern": rule.get('EventPattern', ''),
            "targets": rule.get('Targets', []),
            "region": region,
            "securityScan": "Pass"
        }

        node = self.build_node(
            resource_arn=resource_arn,
            node_type="eventbridgeNode",
            name=rule_name,
            service="eventbridge",
            region=region,
            account_id=account_id,
            metrics=metrics,
            insights="EventBridge Rule"
        )

        fingerprint = self.generate_fingerprint(metrics)

        return {
            "node": node,
            "fingerprint": fingerprint,
            "resource_arn": resource_arn,
            "resource_name": rule_name,
            "raw_id": rule_name
        }

    # ─────────────────────────────────────────
    # PASS 2 EXTENDED NORMALIZERS
    # ─────────────────────────────────────────

