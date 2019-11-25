#!/bin/bash

kubectl create -f ./pulp-redis-deployment.yaml
kubectl create -f ./pulp-redis-service.yaml
