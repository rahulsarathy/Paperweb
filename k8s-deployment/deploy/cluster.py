def GenerateConfig(context):
    """Generate YAML resource configuration."""

    cluster_name = context.properties['CLUSTER_NAME']
    machine_type = context.properties['MACHINE_TYPE']
    cluster_zone = context.properties['CLUSTER_ZONE']
    number_of_pools = context.properties['NUM_POOLS']
    number_of_nodes = context.properties['NUM_NODES']
    gke_version = context.properties['GKE_VERSION']

    locations = [ 'us-central1-a', 'us-central1-b', 'us-central1-c' ]
    resources = []
    resources.append({
        'name': cluster_name,
        'type': 'container.v1.cluster',
        'properties': {
            'zone': cluster_zone,
            'cluster': {
                'name': cluster_name,
                'initialClusterVersion': gke_version,
                'nodePools': [
                    {
                        'name': cluster_name + '-nodepool-' + str(pool+1),
                        'initialNodeCount': number_of_nodes,
                        'version': gke_version,
                        'config': {
                            'machineType': machine_type, 
                            'oauthScopes': [
                                'https://www.googleapis.com/auth/' + scope
                                for scope in [
                                    'compute',
                                    'devstorage.read_only',
                                    'logging.write',
                                    'monitoring'
                                ]
                            ]
                        },
                        'autoscaling': {
                            'enabled': True,
                            'minNodeCount': 1,
                            'maxNodeCount': 3
                        },
                        'management': {
                            'autoUpgrade': True,
                            'autoRepair': True
                        }
                    }
                    for pool in range(number_of_pools)
                ],
                'locations': locations if number_of_pools > 1 else [] 
            } 
        }
    })

    return {'resources': resources}
