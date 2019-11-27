###
# Stage 1 - Throwaway image with C compiler/dependencies
#
FROM python:3.7.4-alpine as buildimage

# update and install dependencies
RUN apk --update \
    add --no-cache --virtual .build-deps \
    gcc \
    linux-headers \
    musl-dev \
    libc-dev \
    python3-dev \
    postgresql \
    postgresql-dev

# instead of installing, create a wheel
RUN pip install --upgrade pip
RUN pip wheel --wheel-dir=/root/wheels uwsgi psycopg2

###
# Stage 2 - Image WITHOUT C compiler
#
FROM python:3.7-alpine

COPY --from=buildimage /root/wheels /root/wheels

# set work directory
WORKDIR /usr/src/app

RUN pip install --upgrade pip

# Copy requirements.txt for cache efficiency
COPY ./requirements.txt /usr/src/app/

# copy application code
# commented out below because in dev we mount our
# local directory via volumes in docker-compose.yaml
# COPY ./app /usr/src/app/

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Get alpine updates
RUN apk --update \
    add --no-cache --virtual .build-deps \
    postgresql-client

# Install from pip archive
RUN pip install -r ./requirements.txt

# Look for archives in # /root/wheels
RUN pip install \
      --no-index \
      --find-links=/root/wheels \
      psycopg2 \
      uwsgi

# run entrypoint-dev.sh
ENTRYPOINT ["/usr/src/app/entrypoint-dev.sh"]
