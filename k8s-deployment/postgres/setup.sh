#!/bin/bash

kubectl create -f ./pulp-postgres-config.yaml
kubectl create -f ./pulp-postgres-secrets.yaml
kubectl create -f ./pulp-postgres-claim.yaml
kubectl create -f ./pulp-postgres-deployment.yaml
kubectl create -f ./pulp-postgres-service.yaml
