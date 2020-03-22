#! /bin/bash

docker exec -it pulp_backend_1 coverage run --source='.' manage.py test

docker exec -it pulp_backend_1 coverage report

docker exec -it pulp_backend_1 coverage html

