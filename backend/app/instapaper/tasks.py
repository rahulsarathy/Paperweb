import logging
from datetime import datetime
import json

from .models import InstapaperCredentials
from reading_list.utils import add_to_reading_list
from pulp.globals import INSTAPAPER_CONSUMER_ID, INSTAPAPER_CONSUMER_SECRET
from progress.types import update_instapaper_queue_status, update_reading_list

from django.contrib.auth.models import User
from celery import task
from django.utils.timezone import make_aware, now
import requests
from requests_oauthlib import OAuth1
import urllib

@task(name='sync_instapaper')
def sync_instapaper():
    users = User.objects.all()
    for user in users:
        try:
            insta_credentials = InstapaperCredentials.objects.get(owner=user)
        except InstapaperCredentials.DoesNotExist:
            # this user does not have pocket setup, nothing to do here
            continue

        parse_instapaper_bookmarks(user.email)


@task(name='parse_instapaper_bookmarks')
def parse_instapaper_bookmarks(email):
    # Get user
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        logging.warning('User {} does not exist'.format(email))
        return

    # Get Instapaper Credentials
    bookmarks_url = 'https://www.instapaper.com/api/1/bookmarks/list'
    try:
        credentials = InstapaperCredentials.objects.get(owner=user)
    except InstapaperCredentials.DoesNotExist:
        logging.warning('Could not find instapaper credentials for {}'.format(email))
        return

    oauth = OAuth1(client_key=INSTAPAPER_CONSUMER_ID, client_secret=INSTAPAPER_CONSUMER_SECRET,
                   resource_owner_key=credentials.oauth_token, resource_owner_secret=credentials.oauth_token_secret)

    # Get previously polled IDs
    polled_bookmarks = credentials.polled_bookmarks
    polled_ids = polled_bookmarks.values()
    have_string = ','.join(str(polled_id) for polled_id in polled_ids)
    data = {
        'have': have_string,
        'limit': 500,
    }

    response = requests.post(bookmarks_url, auth=oauth, data=data)
    bookmarks = json.loads(response.content)
    credentials.last_polled = now()
    credentials.save()

    total_num_of_bookmarks = len(bookmarks) - 2
    complete = 0
    update_instapaper_queue_status(user, 0, total_num_of_bookmarks)
    # Add new URLs
    for bookmark in bookmarks:
        if bookmark.get('type', '') != 'bookmark':
            continue
        link = bookmark.get('url')
        unix_timestamp = bookmark.get('time')
        timestamp = int(unix_timestamp)
        dt_object = make_aware(datetime.fromtimestamp(timestamp))

        try:
            reading_list_item = add_to_reading_list(user, link, dt_object)
        except Exception as e:
            logging.warning("add_to_reading_list failed in instapaper with exception {} from link: {}".format(e, link))
            # failed to add article.
            total_num_of_bookmarks = total_num_of_bookmarks - 1
            update_instapaper_queue_status(user, complete, total_num_of_bookmarks)
            continue

        bookmark_id = bookmark.get('bookmark_id')
        polled_bookmarks[link] = bookmark_id
        credentials.polled_bookmarks = polled_bookmarks
        credentials.save()
        update_reading_list(user, reading_list_item)
        complete = complete + 1
        update_instapaper_queue_status(user, complete, total_num_of_bookmarks)
    return