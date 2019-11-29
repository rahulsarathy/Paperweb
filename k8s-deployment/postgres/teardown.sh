#! /bin/sh

kubectl delete service pulp-postgres-db-service 
kubectl delete deployment pulp-postgres-db-deployment
kubectl delete persistentvolumeclaim pulp-postgres-db-volume-claim
