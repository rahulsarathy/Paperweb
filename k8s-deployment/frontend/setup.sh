#!/bin/bash

kubectl create -f ./pulp-frontend-deployment.yaml
kubectl create -f ./pulp-frontend-service.yaml
