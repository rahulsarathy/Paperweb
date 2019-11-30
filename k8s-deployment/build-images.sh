#! /bin/sh

. ./config.sh

# parser
docker build -f $PROJECT_HOME/parser/Dockerfile.prod -t gcr.io/$PROJECT_ID/pulp-parser:v1 $PROJECT_HOME/parser
docker push gcr.io/$PROJECT_ID/pulp-parser:$IMAGE_VERSION

# backend 
docker build -f $PROJECT_HOME/backend/Dockerfile.prod -t gcr.io/$PROJECT_ID/pulp-backend:v1 $PROJECT_HOME/backend
docker push gcr.io/$PROJECT_ID/pulp-backend:$IMAGE_VERSION

