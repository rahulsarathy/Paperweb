#!/bin/sh

gcloud container images delete gcr.io/prod1-259305/pulp-backend:v1 --force-delete-tags
