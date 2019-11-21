from pulp.settings import *

DATABASES = {
    'default': {
        "ENGINE": os.environ.get("SQL_ENGINE", "django.db.backends.sqlite3"),
        "NAME": os.environ.get("SQL_DATABASE", os.path.join(BASE_DIR, "db.sqlite3")),
        "USER": os.environ.get("SQL_USER", "admin"),
        "PASSWORD": os.environ.get("SQL_PASSWORD", "password"),
        "HOST": os.environ.get("SQL_HOST", "localhost"),
        "PORT": os.environ.get("SQL_PORT", "5432"),
    }
}

STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")

ALLOWED_HOSTS = ['*']

DEBUG = False

# sentry_sdk.init(
#     dsn="https://376f22cb96ba4052a0cb5f47084f452c@sentry.io/1529016",
#    integrations=[DjangoIntegration()]
# )

SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_SSL_REDIRECT = True

JAVASCRIPT_URLS = {
    'landing': '/static/js/build/landing.js',
    'profile': '/static/js/build/profile.js',
    'reading_list':  '/static/js/build/reading_list.js',
    'article': '/static/js/build/article.js',
}

AWS_BUCKET = 'pulpscrapedarticles'

