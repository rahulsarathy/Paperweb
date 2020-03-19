import logging
from datetime import datetime

from .models import PocketCredentials
from .utils import retrieve_pocket
from reading_list.utils import add_to_reading_list

from django.contrib.auth.models import User
from celery import task
from django.utils.timezone import make_aware, now


@task(name='sync_pocket')
def sync_pocket():
    users = User.objects.all()
    for user in users:
        try:
            pocket_credentials = PocketCredentials.objects.get(owner=user)
        except PocketCredentials.DoesNotExist:
            # this user does not have pocket setup, nothing to do here
            continue
        import_pocket.delay(user.email)


@task(name='import_pocket')
def import_pocket(email):
    # Get user
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        logging.warning('User {} does not exist'.format(email))
        return

    new_articles = retrieve_pocket(user)
    # Pocket has no new articles
    if new_articles == []:
        return
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        logging.warning('User {} does not exist'.format(email))
        return
    for key, article in new_articles.items():
        add_from_pocket(user, article)
    return

def add_from_pocket(user, article):
    permalink = article.get('given_url')
    unix_timestamp = article.get('time_added')
    timestamp = int(unix_timestamp)
    dt_object = make_aware(datetime.fromtimestamp(timestamp))
    add_to_reading_list(user, permalink, dt_object)