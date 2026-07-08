import boto3
import logging
from app.scanners.base import BaseScanner, scanner
from app.engines.normalizer import normalizer

logger = logging.getLogger(__name__)


@scanner(service="eventbridge", scope="regional", priority=100)
class EventBridgeScanner(BaseScanner):

    def scan(self, credentials: dict, region: str = None, aws_account_id: str = None, subnet_map: dict = None, **kwargs) -> dict:
        account_id = aws_account_id
        nodes = []
        edges = []
        errors = []

        try:
            events = boto3.client(
                'events',
                region_name=region,
                aws_access_key_id=credentials['AccessKeyId'],
                aws_secret_access_key=credentials['SecretAccessKey'],
                aws_session_token=credentials['SessionToken']
            )

            # Get rules
            response = events.list_rules()
            for rule in response.get('Rules', []):
                try:
                    rule_name = rule['Name']
                    # Get targets
                    targets_res = events.list_targets_by_rule(Rule=rule_name)
                    targets = [
                        {
                            "id": t.get('Id'),
                            "arn": t.get('Arn')
                        } for t in targets_res.get('Targets', [])
                    ]

                    rule['Targets'] = targets

                    result = normalizer.normalize_eventbridge(
                        rule=rule,
                        region=region,
                        account_id=account_id
                    )
                    nodes.append(result)
                    logger.info(f"EventBridge rule scanned: {rule_name}")

                except Exception as e:
                    errors.append(f"EventBridge rule error for {rule.get('Name')}: {str(e)}")

        except Exception as e:
            errors.append(f"EventBridge scanner error: {str(e)}")

        return {
            "nodes": nodes,
            "edges": edges,
            "errors": errors,
            "service": "eventbridge",
            "region": region
        }


