import json
from typing import Optional
from app.engines.normalizers.base import BaseNormalizer, normalizer

@normalizer(service="security_group")
class SecurityGroupNormalizer(BaseNormalizer):
    def normalize(self, sg: dict, region: str, account_id: str) -> dict:
        sg_id = sg['GroupId']
        sg_name = sg.get('GroupName', sg_id)
        vpc_id = sg.get('VpcId', '')
        resource_arn = f'arn:aws:ec2:{region}:{account_id}:security-group/{sg_id}'
        inbound = sg.get('IpPermissions', [])
        outbound = sg.get('IpPermissionsEgress', [])
        open_inbound = any((r.get('IpProtocol') == '-1' or any((ip.get('CidrIp') == '0.0.0.0/0' for ip in r.get('IpRanges', []))) for r in inbound))
        referenced_sg_ids = []
        for rule in inbound:
            for pair in rule.get('UserIdGroupPairs', []):
                gid = pair.get('GroupId')
                if gid:
                    referenced_sg_ids.append(gid)
        metrics = {'sgId': sg_id, 'vpcId': vpc_id, 'inboundRuleCount': len(inbound), 'outboundRuleCount': len(outbound), 'openInbound': open_inbound, 'referencedSgIds': referenced_sg_ids, 'region': region, 'securityScan': 'Warning: Open inbound 0.0.0.0/0' if open_inbound else 'Pass'}
        node = self.build_node(resource_arn=resource_arn, node_type='securityGroupNode', name=sg_name, service='securitygroup', region=region, account_id=account_id, metrics=metrics, insights='Open Inbound' if open_inbound else 'Restricted')
        fingerprint = self.generate_fingerprint(metrics)
        return {'node': node, 'fingerprint': fingerprint, 'resource_arn': resource_arn, 'resource_name': sg_name, 'raw_id': sg_id, 'vpc_id': vpc_id}

