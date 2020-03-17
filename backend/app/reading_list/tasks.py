import os
import logging
from datetime import datetime
import json

from pulp.globals import HTML_BUCKET, INSTAPAPER_CONSUMER_ID, INSTAPAPER_CONSUMER_SECRET
from reading_list.models import Article, ReadingListItem
from reading_list.utils import add_to_reading_list, handle_pages, \
    html_to_s3, get_parsed, retrieve_pocket, get_staged_articles, inject_json_into_html
from reading_list.models import PocketCredentials, InstapaperCredentials
from utils.s3_utils import check_file, get_article_id, download_link, get_magazine_id, put_object
from django.contrib.auth.models import User

from celery import task
from celery import shared_task
from django.utils.timezone import make_aware, now
from bs4 import BeautifulSoup
import requests
from requests_oauthlib import OAuth1
import urllib


@task(name='handle_pages')
def handle_pages_task(link, email=None):
    try:
        article = Article.objects.get(permalink=link)
    except Article.DoesNotExist:
        logging.warning('Article {} does not exist'.format(link))
        return

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        # triggered from backfill_pages command
        return handle_pages(article)

    handle_pages(article, user)
    return


@task(name='sync_instapaper')
def sync_instapaper():
    users = User.objects.all()
    for user in users:
        try:
            insta_credentials = InstapaperCredentials.objects.get(owner=user)
        except InstapaperCredentials.DoesNotExist:
            # this user does not have pocket setup, nothing to do here
            continue

        parse_instapaper_bookmarks.delay(user.email)


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
        'have': have_string
    }

    response = requests.post(bookmarks_url, auth=oauth, data=data)
    bookmarks = json.loads(response.content)

    # Add new URLs
    for bookmark in bookmarks:
        if bookmark.get('type', '') != 'bookmark':
            continue
        bookmark_id = bookmark.get('bookmark_id')
        link = bookmark.get('url')
        polled_bookmarks[link] = bookmark_id
        unix_timestamp = bookmark.get('time')
        timestamp = int(unix_timestamp)
        dt_object = make_aware(datetime.fromtimestamp(timestamp))
        add_to_reading_list(user, link, dt_object)
    credentials.polled_bookmarks = polled_bookmarks
    credentials.last_polled = now()
    credentials.save()

@task(name='start_create_magazine')
def start_create_magazine():
    users = User.objects.all()
    for user in users:
        create_user_magazine.delay(user.email)
    return

@task(name='create_user_magazine')
def create_user_magazine(email):
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        logging.warning('User {} does not exist'.format(email))
        return

    staged = get_staged_articles(user)

    assembly_soup = BeautifulSoup(open('./pdf/assembly.html'), 'html.parser')
    assembly_body = assembly_soup.find('body')
    magazine_id = get_magazine_id(staged[0].permalink)

    for item in staged:
        permalink = item.permalink
        article_id = get_article_id(permalink)

        # get article and check if uploaded
        article, article_created = Article.objects.get_or_create(
            permalink=permalink
        )
        if not check_file('{}.html'.format(article_id), HTML_BUCKET):
            html_to_s3(article)

        # populate template soup w/ content
        injected_soup = inject_json_into_html(article)
        injected_container = injected_soup.select_one('.container')
        injected_container['id'] = article_id

        # Add populated template soup to assembly soup
        assembly_body.append(injected_container)

    f = open("./{}.html".format(magazine_id), "w+")
    f.write(str(assembly_soup))
    f.close()
    put_object('pulpmagazines', "{}.html".format(magazine_id), "./{}.html".format(magazine_id))
    os.remove("./{}.html".format(magazine_id))

    return

