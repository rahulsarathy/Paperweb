#!/bin/bash

kubectl create -f ./pulp-backend-deployment.yaml
kubectl create -f ./pulp-backend-service.yaml
