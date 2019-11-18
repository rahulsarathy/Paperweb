#! /bin/sh

kubectl delete service frontend 
kubectl delete deployment frontend
kubectl delete persistentvolumeclaim frontend-claim-volume
