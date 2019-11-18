#!/bin/bash

kubectl create -f ./backend-configmap.yaml
kubectl create -f ./backend-deployment.yaml
kubectl create -f ./backend-service.yaml
