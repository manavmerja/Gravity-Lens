import logging
from app.engines.normalizers.base import BaseNormalizer, normalizer

logger = logging.getLogger(__name__)

@normalizer(service="alb")
class AlbNormalizer(BaseNormalizer):
    def normalize(self, alb, target_groups, region, account_id) -> dict:
        arn = alb['LoadBalancerArn']
        name = alb['LoadBalancerName']
        metrics = {
            "targetGroups": target_groups, 
            "region": region,
            "DNSName": alb.get('DNSName', ''),
            "securityGroups": alb.get('SecurityGroups', []),
            "vpcId": alb.get('VpcId', ''),
            "subnets": [az.get('SubnetId') for az in alb.get('AvailabilityZones', [])]
        }
        node = self.build_node(arn, "albNode", name, "alb", region, account_id, metrics)
        return {"node": node, "resource_arn": arn, "resource_name": name, "raw_id": arn}

