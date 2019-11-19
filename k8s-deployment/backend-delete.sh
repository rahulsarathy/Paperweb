#! /bin/sh

kubectl delete service backend 
kubectl delete deployment backend
kubectl delete configmap backend-config
