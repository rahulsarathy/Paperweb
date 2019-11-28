#!/bin/sh

. ../config.sh

component="parser"
input=$1
dir=`dirname "$input"`
path=`basename "$input"`

# Check component directory and component
if [ -d $input ] && [ $path = $component ] && [ -f $input/Dockerfile.prod ]; then
   echo "Verified component directory for $component" 
   cd $input 
   echo "Building $component Image" 
   docker build -f Dockerfile.prod -t gcr.io/$PROJECT_ID/pulp-$component:$IMAGE_VERSION .
   echo "Pushing $component Image to gcr.io" 
   docker push gcr.io/$PROJECT_ID/pulp-$component:$IMAGE_VERSION
else
   echo "Invalid directory for $component image" 
fi
