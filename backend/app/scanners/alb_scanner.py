import boto3
import json
import logging
from botocore.config import Config
from app.scanners.base import BaseScanner, scanner
from app.engines.normalizer import normalizer

logger = logging.getLogger(__name__)

retry_config = Config(
    retries={
        'max_attempts': 10,
        'mode': 'adaptive'
    }
)

@scanner(service="alb", scope="regional", priority=150)
class AlbScanner(BaseScanner):
    
    def _get_boto(self, service, region, creds):
        return boto3.client(
            service, region_name=region,
            aws_access_key_id=creds['AccessKeyId'],
            aws_secret_access_key=creds['SecretAccessKey'],
            aws_session_token=creds['SessionToken'],
            config=retry_config
        )

    def scan(self, credentials: dict, region: str = None, aws_account_id: str = None, subnet_map: dict = None, **kwargs) -> dict:
        account_id = aws_account_id

        nodes, edges, errors = [], [], []
        try:
            elbv2 = self._get_boto('elbv2', region, credentials)

            # Step 1: Collect all ALBs via pagination
            albs = []
            alb_paginator = elbv2.get_paginator('describe_load_balancers')
            for page in alb_paginator.paginate():
                albs.extend(page.get('LoadBalancers', []))

            alb_by_arn = {alb['LoadBalancerArn']: alb for alb in albs}

            # Step 2: Collect ALL target groups in one paginated call (no per-ALB filter).
            # Each TG response includes LoadBalancerArns — use that to associate back.
            tgs_by_alb = {arn: [] for arn in alb_by_arn}
            tg_paginator = elbv2.get_paginator('describe_target_groups')
            for page in tg_paginator.paginate():
                for tg in page.get('TargetGroups', []):
                    for lb_arn in tg.get('LoadBalancerArns', []):
                        if lb_arn in tgs_by_alb:
                            tgs_by_alb[lb_arn].append(tg)

            # Step 3: Collect target health per TG (one call per TG — acceptable, paginated)
            for alb_arn, alb in alb_by_arn.items():
                target_groups_data = []
                for tg in tgs_by_alb.get(alb_arn, []):
                    tg_arn = tg['TargetGroupArn']
                    target_type = tg.get('TargetType', 'instance')
                    try:
                        th_paginator = elbv2.get_paginator('describe_target_health')
                        healths = []
                        for page in th_paginator.paginate(TargetGroupArn=tg_arn):
                            healths.extend(page.get('TargetHealthDescriptions', []))
                        targets = [{"Id": h['Target']['Id']} for h in healths]
                    except Exception:
                        targets = []
                    target_groups_data.append({
                        "TargetGroupArn": tg_arn,
                        "TargetType": target_type,
                        "Targets": targets
                    })
                nodes.append(normalizer.normalize_alb(alb, target_groups_data, region, account_id))
        except Exception as e:
            errors.append(str(e))
        return {"nodes": nodes, "edges": edges, "errors": errors}

