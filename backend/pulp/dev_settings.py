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

ALLOWED_HOSTS = [NGROK_HOST, '127.0.0.1', 'localhost']

SESSION_COOKIE_SECURE = False
CSRF_COOKIE_SECURE = False
SECURE_SSL_REDIRECT = False

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

JAVASCRIPT_URLS = {
    'landing': 'http://localhost:8080/landing.js',
    'dashboard': 'http://localhost:8080/dashboard.js',
    'profile': 'http://localhost:8080/profile.js',
    'feed': 'http://localhost:8080/feed.js',
    'reading_list': 'http://localhost:8080/reading_list.js',
}

AWS_BUCKET = 'pulpscrapedarticlestest'
