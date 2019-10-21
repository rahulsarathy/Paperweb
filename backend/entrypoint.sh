#!/bin/sh

if [ "$DATABASE" = "postgres" ]
then
    echo "Waiting for postgres..."

    while ! nc -z $SQL_HOST $SQL_PORT; do
      sleep 0.1
    done

    echo "PostgreSQL started"
fi

# Commented out because we are restoring the database from a dump
# Uncommenting these will initialize the database to initial state
# python manage.py flush --no-input
# python manage.py migrate

exec "$@"
