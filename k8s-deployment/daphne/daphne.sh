#!/usr/bin/env bash

daphne -b 0.0.0.0 -p 8001 pulp.asgi:channel_layer
python manage.py runworker