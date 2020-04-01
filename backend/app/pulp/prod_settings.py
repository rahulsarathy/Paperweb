from pulp.settings import *
import os
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration
from sentry_sdk.integrations.redis import RedisIntegration
from sentry_sdk.integrations.celery import CeleryIntegration

SITE_ID = os.environ.get('SITE_ID')

DATABASES = {
    'default': {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.environ.get("SQL_DATABASE", "pulp_db"),
        "USER": os.environ.get("SQL_USER", "admin"),
        "PASSWORD": os.environ.get("SQL_PASSWORD", "password"),
        "HOST": os.environ.get("SQL_HOST", "pulp-db-host"),
        "PORT": os.environ.get("SQL_PORT", "5432"),
    }
}

DEBUG = False

sentry_sdk.init(
    dsn="https://376f22cb96ba4052a0cb5f47084f452c@sentry.io/1529016",
    integrations=[DjangoIntegration(), RedisIntegration(), CeleryIntegration()]
)

JAVASCRIPT_URLS = {
    'landing': '/static/js/build/landing.js',
    'switcher': '/static/js/build/switcher.js',
    'article': '/static/js/build/article.js',
    'subscribe': '/static/js/build/subscribe.js',
    'newsletters': '/static/js/build/newsletters.js',
}

CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://pulp-redis-service:6379/0",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        }
    }
}

RECAPTCHA_PUBLIC_KEY = os.environ.get('RECAPTCHA_PUBLIC_KEY')
RECAPTCHA_PRIVATE_KEY = os.environ.get('RECAPTCHA_PRIVATE_KEY')

