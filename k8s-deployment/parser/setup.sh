#!/bin/bash

kubectl create -f ./pulp-parser-deployment.yaml
kubectl create -f ./pulp-parser-service.yaml
