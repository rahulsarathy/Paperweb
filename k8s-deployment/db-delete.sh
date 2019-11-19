#! /bin/sh

kubectl delete service db 
kubectl delete deployment db
kubectl delete configmap db-config
kubectl delete persistentvolumeclaim db-claim-volume
