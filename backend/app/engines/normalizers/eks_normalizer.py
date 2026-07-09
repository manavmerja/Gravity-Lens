import logging
from app.engines.normalizers.base import BaseNormalizer, normalizer

logger = logging.getLogger(__name__)

@normalizer(service="eks")
class EksNormalizer(BaseNormalizer):
    def normalize(self, cluster, nodegroup_arns, region, account_id) -> dict:
        arn = cluster.get('arn', f"arn:aws:eks:{region}:{account_id}:cluster/{cluster.get('name')}")
        name = cluster.get('name', 'eks')
        metrics = {
            "roleArn": cluster.get('roleArn', ''),
            "securityGroupIds": cluster.get('resourcesVpcConfig', {}).get('securityGroupIds', []),
            "nodegroupArns": nodegroup_arns,
            "region": region
        }
        node = self.build_node(arn, "eksNode", name, "eks", region, account_id, metrics)
        return {"node": node, "resource_arn": arn, "resource_name": name, "raw_id": arn}


