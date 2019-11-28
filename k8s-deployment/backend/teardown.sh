#! /bin/sh

kubectl delete secrets pulp-backend-credentials
kubectl delete service pulp-backend-service
kubectl delete deployment pulp-backend-deployment
kubectl delete configmap pulp-backend-config
