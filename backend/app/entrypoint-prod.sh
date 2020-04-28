#!/bin/sh

while ! pg_isready -h ${SQL_HOST} -p ${SQL_PORT} > /dev/null 2> /dev/null; do
    >&2 echo "Postgres on host ${SQL_HOST} is not up yet - sleeping"
    sleep 1
done

>&2 echo "Postgres is up now - continuing"

#echo "Running migrations"
#python manage.py makemigrations
#python manage.py migrate
#echo "Finished running migrations!"

echo "Running collectstatic"
python manage.py collectstatic --noinput
if [ -d staticfiles ]; then 
   echo " -> collectstatic was successful!"
else
   echo " -> ** ERROR: collectstatic was not successful **"
fi
>&2 echo "Finished running collectstatic"

exec "$@"
