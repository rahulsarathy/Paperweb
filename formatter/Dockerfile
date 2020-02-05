FROM python:3.7.4-alpine

RUN apk add chromium-chromedriver
RUN apk add chromium
RUN set -ex && apk --no-cache add sudo

RUN adduser -D printer_start

WORKDIR /home/printer_start

COPY ./requirements.txt requirements.txt
RUN pip install -r requirements.txt
RUN pip install gunicorn

COPY app app
COPY printer_start.py config.py boot.sh ./
RUN chmod +x boot.sh

ENV FLASK_APP printer_start.py
ENV FLASK_ENV development
ENV CHROME_BIN=/usr/bin/chromium-browser \
    CHROME_PATH=/usr/lib/chromium/

RUN chown -R printer_start:printer_start ./
USER printer_start

EXPOSE 5000
ENTRYPOINT ["./boot.sh"]