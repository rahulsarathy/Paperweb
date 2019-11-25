#!/bin/sh

. ../config.sh

build="backend"
input=$1
dir=`dirname "$input"`
path=`basename "$input"`

# Check build directory and build
if [ -d $input ] && [ $path = $build ] && [ -f $input/Dockerfile.prod ]; then
   echo "Verified build directory for $build" 
   cd $input 
   echo "Building $build Image" 
   docker build -f Dockerfile.prod -t gcr.io/$PROJECT_ID/pulp-backend:v1 .
   echo "Pushing $build Image to gcr.io" 
   docker push gcr.io/$PROJECT_ID/pulp-backend:$IMAGE_VERSION
else
   echo "Invalid directory for backend image" 
fi
