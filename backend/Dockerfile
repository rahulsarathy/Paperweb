# pull official base image
FROM python:3.7.4-alpine

# set work directory
WORKDIR /usr/src/app

# copy code
COPY . /usr/src/app/

# update and install dependencies
RUN apk --update \
    add --no-cache --virtual .build-deps \
    gcc \
    musl-dev \
    libc-dev \
    python3-dev \
    postgresql \
    postgresql-dev \
    && pip install --upgrade pip \
    && pip install -r ./requirements.txt \ 
    && find /usr/local \
        \( -type d -a -name test -o -name tests \) \
        -o \( -type f -a -name '*.pyc' -o -name '*.pyo' \) \
        -exec rm -rf '{}' + \
    && runDeps="$( \
        scanelf --needed --nobanner --recursive /usr/local \
                | awk '{ gsub(/,/, "\nso:", $2); print "so:" $2 }' \
                | sort -u \
                | xargs -r apk info --installed \
                | sort -u \
    )" \
    && apk add --virtual .rundeps $runDeps \
    && apk del .build-deps

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# run entrypoint-dev.sh
ENTRYPOINT ["/usr/src/app/entrypoint-dev.sh"]
