import os
basedir = os.path.abspath(os.path.dirname(__file__))

class Config(object):
    DEBUG = True
    SECRET_KEY = os.environ.get('SECRET_KEY', 'testing')
    # SQLALCHEMY_DATABASE_URI = os.environ['DATABASE_URL']
