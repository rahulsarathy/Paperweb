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
    postgresql-dev \
    libffi-dev \
    openssl-dev \
    fortify-headers \
    libxml2-dev \
    jpeg-dev \
    zlib \
    zlib-dev \
    libpng-dev \
    libxslt-dev


# instead of installing, create a wheel
RUN pip install --upgrade pip
RUN pip wheel --wheel-dir=/root/wheels psycopg2
RUN pip wheel --wheel-dir=/root/wheels vcrpy
RUN pip wheel --wheel-dir=/root/wheels cryptography
RUN pip wheel --wheel-dir=/root/wheels psutil
RUN pip wheel --wheel-dir=/root/wheels twisted
RUN pip wheel --wheel-dir=/root/wheels hiredis
RUN pip wheel --wheel-dir=/root/wheels Pillow
RUN pip wheel --wheel-dir=/root/wheels newspaper3k

###
# Stage 2 - Image WITHOUT C compiler
#
FROM python:3.7.4-alpine

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
    postgresql-client \
    libjpeg \
    libjpeg-turbo-dev \
    libxslt-dev

ENV LIBRARY_PATH=/lib:/usr/lib

# for django-encrypted-model-fields
#RUN apk add gcc musl-dev libffi-dev openssl-dev python3-dev && pip install django-encrypted-model-fields

# for psutil
#RUN apk add --update gcc libc-dev fortify-headers linux-headers && rm -rf

# Look for archives in # /root/wheels
RUN pip install \
      --no-index \
      --find-links=/root/wheels \
      psycopg2
RUN pip install \
      --no-index \
      --find-links=/root/wheels \
      vcrpy

RUN pip install \
      --no-index \
      --find-links=/root/wheels \
      psutil

RUN pip install \
      --no-index \
      --find-links=/root/wheels \
      cryptography


# channels dependencies
RUN pip install \
      --no-index \
      --find-links=/root/wheels \
      twisted

RUN pip install \
      --no-index \
      --find-links=/root/wheels \
      hiredis

RUN pip install \
      --no-index \
      --find-links=/root/wheels \
      Pillow

RUN pip install \
      --no-index \
      --find-links=/root/wheels \
      newspaper3k

# Install from pip archive
RUN pip install -r ./requirements.txt
RUN python -m \
    nltk.downloader \
    brown \
    punkt \
    maxent_treebank_pos_tagger \
    movie_reviews \
    wordnet stopwords \
    averaged_perceptron_tagger

# run entrypoint-dev.sh
ENTRYPOINT ["/usr/src/app/entrypoint-dev.sh"]
