#! /bin/sh

kubectl delete service pulp-celery-beat-service
kubectl delete deployment pulp-celery-beat-deployment
