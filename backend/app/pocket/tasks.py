import logging
from datetime import datetime
import time
import json

from reading_list.utils import add_to_reading_list
from progress.types import update_pocket_queue_status
from pulp.globals import POCKET_CONSUMER_KEY
from .models import PocketCredentials


from django.contrib.auth.models import User
from celery import task
from django.utils.timezone import make_aware, now
from django.utils import timezone
import requests


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
    total = len(new_articles.items())
    completed = 0
    for key, article in new_articles.items():
        add_from_pocket(user, article)
        completed = completed + 1
        update_pocket_queue_status(user, completed, total)
    return

def add_from_pocket(user, article):
    permalink = article.get('given_url')
    unix_timestamp = article.get('time_added')
    timestamp = int(unix_timestamp)
    dt_object = make_aware(datetime.fromtimestamp(timestamp))
    add_to_reading_list(user, permalink, dt_object, False)

def retrieve_pocket(user):
    url = 'https://getpocket.com/v3/get'

    try:
        pocket_credentials = PocketCredentials.objects.get(owner=user)
    except PocketCredentials.DoesNotExist:
        # this user does not have pocket setup, nothing to do here
        return
    last_polled = pocket_credentials.last_polled
    access_token = pocket_credentials.token

    if last_polled is None:
        data = {'consumer_key': POCKET_CONSUMER_KEY, 'access_token': access_token, 'state': 'unread'}
    else:
        timestamp = time.mktime(last_polled.timetuple())
        data = {'since': timestamp, 'consumer_key': POCKET_CONSUMER_KEY, 'access_token': access_token, 'state': 'unread'}
    response = requests.post(url, data=data)
    if response.status_code != 200:
        pocket_credentials.invalid = True
        pocket_credentials.save()
        return {}
    response_string = response.content.decode("utf-8")
    json_response = json.loads(response_string)
    articles = json_response.get('list')

    try:
        pocket_credential = PocketCredentials.objects.get(owner=user)
        pocket_credential.token = access_token
        pocket_credential.last_polled = timezone.now()
        pocket_credential.save()
    except PocketCredentials.DoesNotExist:
        PocketCredentials(owner=user, token=access_token, last_polled=timezone.now()).save()
    return articles