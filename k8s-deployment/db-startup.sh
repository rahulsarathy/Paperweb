#!/bin/bash

kubectl create -f ./db-configmap.yaml
kubectl create -f ./db-claim.yaml
kubectl create -f ./db-deployment.yaml
kubectl create -f ./db-service.yaml
