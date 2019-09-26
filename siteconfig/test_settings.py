from siteconfig.settings import *

print("using test config")

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'pulp',
        'USER': 'pulp_admin',
        'PASSWORD': 'cat',
        'HOST': 'localhost',
        'PORT': '5432'
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
}