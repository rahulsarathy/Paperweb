#! /bin/sh

kubectl delete service pulp-postgres-db-service 
kubectl delete deployment pulp-postgres-db-deployment
kubectl delete secrets pulp-postgres-db-credentials
kubectl delete config pulp-postgres-db-config
kubectl delete persistentvolumeclaim pulp-postgres-db-volume-claim
