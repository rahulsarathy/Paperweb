#!/bin/bash

kubectl create -f ./pulp-daphne-deployment.yaml
kubectl create -f ./pulp-daphne-service.yaml
