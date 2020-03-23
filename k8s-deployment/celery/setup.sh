#!/bin/bash

kubectl create -f ./pulp-celery-deployment.yaml
kubectl create -f ./pulp-celery-service.yaml
