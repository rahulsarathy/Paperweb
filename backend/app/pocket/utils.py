import time
import json

from .models import PocketCredentials
from pulp.globals import POCKET_CONSUMER_KEY

from django.utils import timezone
import requests

def retrieve_pocket(user, access_token, last_polled=None):
    url = 'https://getpocket.com/v3/get'
    if last_polled is None:
        data = {'consumer_key': POCKET_CONSUMER_KEY, 'access_token': access_token, 'state': 'unread'}
    else:
        timestamp = time.mktime(last_polled.timetuple())
        data = {'since': timestamp, 'consumer_key': POCKET_CONSUMER_KEY, 'access_token': access_token, 'state': 'unread'}
    response = requests.post(url, data=data)
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