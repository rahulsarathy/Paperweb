from pulp.settings import *

DATABASES = {
    "default": {
        "ENGINE": os.environ.get("SQL_ENGINE", "django.db.backends.sqlite3"),
        "NAME": os.environ.get("SQL_DATABASE", os.path.join(BASE_DIR, "db.sqlite3")),
        "USER": os.environ.get("SQL_USER", "user"),
        "PASSWORD": os.environ.get("SQL_PASSWORD", "password"),
        "HOST": os.environ.get("SQL_HOST", "localhost"),
        "PORT": os.environ.get("SQL_PORT", "5432"),
    }
}

ALLOWED_HOSTS = ['127.0.0.1', 'localhost', '10.105.80.65']

SESSION_COOKIE_SECURE = False
CSRF_COOKIE_SECURE = False
SECURE_SSL_REDIRECT = False

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

JAVASCRIPT_URLS = {
    'landing': 'http://localhost:8080/landing.js',
    'profile': 'http://localhost:8080/profile.js',
    'reading_list': 'http://localhost:8080/reading_list.js',
    'article': 'http://localhost:8080/article.js',

}

AWS_BUCKET = 'pulpscrapedarticlestest'

RECAPTCHA_PUBLIC_KEY = os.environ.get('RECAPTCHA_PUBLIC_KEY')
RECAPTCHA_PRIVATE_KEY = os.environ.get('RECAPTCHA_PRIVATE_KEY')

CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://redis:6379/0",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        }
    }
}