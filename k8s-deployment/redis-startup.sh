#!/bin/bash

kubectl create -f ./redis-deployment.yaml
kubectl create -f ./redis-service.yaml
