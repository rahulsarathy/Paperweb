# Build an image and restore the database
FROM postgres:12.0-alpine

# Environment
ENV PGDATA /var/lib/postgresql/data

# Copy Data to be restored
COPY ./restore-data/* /docker-entrypoint-initdb.d/

EXPOSE 5432
