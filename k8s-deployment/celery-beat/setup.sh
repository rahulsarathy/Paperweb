#!/bin/bash

kubectl create -f ./pulp-celery-beat-deployment.yaml
kubectl create -f ./pulp-celery-beat-service.yaml
