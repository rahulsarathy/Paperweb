#! /bin/sh

. ./config.sh

gcloud container images delete gcr.io/$PROJECT_ID/pulp-backend:$IMAGE_VERSION --force-delete-tags
gcloud container images delete gcr.io/$PROJECT_ID/pulp-frontend:$IMAGE_VERSION --force-delete-tags
gcloud container images delete gcr.io/$PROJECT_ID/pulp-parser:$IMAGE_VERSION --force-delete-tags
