#!/bin/sh

while ! pg_isready -h ${SQL_HOST} -p ${SQL_PORT} > /dev/null 2> /dev/null; do
    >&2 echo "Postgres on host ${SQL_HOST} is not up yet - sleeping"
    sleep 1
done

>&2 echo "Postgres is up now - continuing"

exec "$@"
