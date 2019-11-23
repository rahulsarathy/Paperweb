#!/bin/sh

until psql $SQL_HOST -c '\l'; do
    >&2 echo "Postgres is unavailable - sleeping"
    sleep 1
done

>&2 echo "Postgres is up - continuing"

if [ "x$DJANGO_MANAGEPY_MIGRATE" = 'xon' ]; then
    python manage.py flush --no-input
    python manage.py makemigrations
    python manage.py migrate
fi

exec "$@"
