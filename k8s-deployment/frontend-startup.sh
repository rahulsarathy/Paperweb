#!/bin/bash

kubectl create -f ./frontend-claim.yaml
kubectl create -f ./frontend-deployment.yaml
kubectl create -f ./frontend-service.yaml
