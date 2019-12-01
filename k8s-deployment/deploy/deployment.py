# Copyright 2016 Google Inc. All rights reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""Create configuration to deploy Kubernetes resources."""


def GenerateConfig(context):
    """Generate YAML resource configuration."""

    cluster_types_root = ''.join([
        context.env['project'],
        '/',
        context.properties['clusterType']
    ])
    cluster_types = {
        'Service': ''.join([
            cluster_types_root,
            ':',
            '/api/v1/namespaces/{namespace}/services'
        ]),
        'Deployment': ''.join([
            cluster_types_root,
            '-apps',
            ':',
            '/apis/apps/v1beta1/namespaces/{namespace}/deployments'
        ])
    }

    name = context.env['name']
    tier = context.properties['tier']
    component_prefix = context.env['name'] + \
        '-' + context.properties['component']
    port = context.properties['port']

    liveness_check = {
        'httpGet': {
            'path': 'ready/',
            'port': port
        },
        'initialDelaySeconds': 30,
        'periodSeconds': 20,
    }

    readiness_check = {
        'httpGet': {
            'path': 'ready/',
            'port': port
        },
        'initialDelaySeconds': 15,
        'periodSeconds': 20,
        'timeoutSeconds': 10,
        'successThreshold': 1,
        'failureThreshold': 2
    }

    resources = [
        {
            'name': component_prefix + '-service',
            'type': cluster_types['Service'],
            'properties': {
                'apiVersion': 'v1',
                'kind': 'Service',
                'namespace': 'default',
                'metadata': {
                    'name': component_prefix + '-service',
                    'labels': {
                        'component': component_prefix + '-service',
                        'tier': tier
                    }
                },
                'spec': {
                    'type': 'NodePort',
                    'ports': [{
                        'port': port,
                        'targetPort': port,
                        'protocol': 'TCP'
                    }],
                    'selector': {
                        'component': component_prefix + '-pod',
                        'tier': tier
                    }
                }
            }
        },
        {
            'name': component_prefix + '-deployment',
            'type': cluster_types['Deployment'],
            'properties': {
                'apiVersion': 'apps/v1beta1',
                'kind': 'Deployment',
                'namespace': 'default',
                'metadata': {
                    'name': component_prefix + '-deployment',
                    'labels': {
                        'component': component_prefix + '-pod',
                        'tier': tier
                    }
                },
                'spec': {
                    'replicas': 1,
                    'strategy': 'Recreate',
                    'selector': {
                        'matchLabels': {
                            'component': component_prefix + '-pod',
                        }
                    },
                    'template': {
                        'metadata': {
                            'labels': {
                                'component': component_prefix + '-pod',
                                'tier': tier
                            }
                        },
                        'spec': {
                            'containers': [{
                                'name': component_prefix,
                                'image': context.properties['image'],
                                'imagePullPolicy': 'Always',
                                'livenessProbe': if context.properties['add_liveness_probe'] else {}
                                'readinessProbe': if context.properties['add_readiness_probe'] else {}
                                'ports': [{
                                    'containerPort': port
                                }]
                            }]
                        }
                    }
                }
            }
        }]

    return {'resources': resources}
