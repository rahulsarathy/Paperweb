from siteconfig.settings import *

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'pulp',
        'USER': 'admin',
        'PASSWORD': 's@>03u9-y;2ug`Tjd2h261',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")

ALLOWED_HOSTS = ['*']

DEBUG = False

sentry_sdk.init(
    dsn="https://376f22cb96ba4052a0cb5f47084f452c@sentry.io/1529016",
    integrations=[DjangoIntegration()]
)

SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_SSL_REDIRECT = True

JAVASCRIPT_URLS = {
    'landing': '/static/js/build/landing.js',
    'dashboard': '/static/js/build/dashboard.js',
    'profile': '/static/js/build/profile.js',
}

