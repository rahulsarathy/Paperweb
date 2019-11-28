#!/bin/bash

kubectl create -f ./pulp-backend-secrets.yaml
kubectl create -f ./pulp-backend-config.yaml
kubectl create -f ./pulp-backend-deployment.yaml
kubectl create -f ./pulp-backend-service.yaml
