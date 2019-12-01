#!/bin/sh

# Steps 
#
# 1. Build backend and parser
# 2. Push backend and parser to gcr.io
# 3. Create the Kubernetes Cluster
# 4. Create Config maps and secrets
# 5. Create Postgrres deployment
# 6. Create parser deployment
# 7. Create redis deployment
# 8. Create backend deployment
#     * This automatically performs collectstatic as part of the entrypoint-prod.sh
#     * Make migrations must be run next
# 9. Perform migrations
#     * kubectl get pods (get <backend pod id>
#     * kubectl exec <backend pod id> -- python manage.py makemigrations
#     * kubectl exec <backend pod id> -- python manage.py migrate
# 10. Create the ingress

NAME="test-1-2"
ZONE="us-central1-a"
NUM_NODES=2
NUM_POOLS=1
GKE_VERSION="latest"
MACHINE_TYPE="g1-small"
gcloud deployment-manager deployments create ${NAME} \
--template cluster.py \
--properties=CLUSTER_NAME:${NAME},CLUSTER_ZONE:${ZONE},MACHINE_TYPE:${MACHINE_TYPE},NUM_NODES:${NUM_NODES},NUM_POOLS:${NUM_POOLS},GKE_VERSION:${GKE_VERSION} 
