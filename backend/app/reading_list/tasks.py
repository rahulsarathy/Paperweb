from celery import task
import logging
from reading_list.models import Article, ReadingListItem
from celery import task
from celery import shared_task
import logging
from reading_list.utils import add_to_reading_list, handle_pages, \
    html_to_s3, get_parsed, retrieve_pocket, get_staged_articles, inject_json_into_html
from reading_list.models import PocketCredentials, InstapaperCredentials
from datetime import datetime
from django.contrib.auth.models import User
from django.utils.timezone import make_aware
from utils.s3_utils import check_file, get_article_id, download_link, get_magazine_id, put_object
from pulp.globals import HTML_BUCKET
import os
from bs4 import BeautifulSoup


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

@task(name='import_pocket')
def import_pocket(email, article_json):
    if not article_json:
        return
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        logging.warning('User {} does not exist'.format(email))
        return
    for key, article in article_json.items():
        add_from_pocket(user, article)
    return


@task(name='sync_pocket')
def sync_pocket():
    users = User.objects.all()
    for user in users:
        try:
            pocket_credentials = PocketCredentials.objects.get(owner=user)
        except PocketCredentials.DoesNotExist:
            # this user does not have pocket setup, nothing to do here
            continue

        token = pocket_credentials.token
        last_polled = pocket_credentials.last_polled
        new_articles = retrieve_pocket(user, token, last_polled)
        import_pocket.delay(user.email, new_articles)


def add_from_pocket(user, article):
    permalink = article.get('given_url')
    unix_timestamp = article.get('time_added')
    timestamp = int(unix_timestamp)
    dt_object = make_aware(datetime.fromtimestamp(timestamp))
    add_to_reading_list(user, permalink, dt_object)

@shared_task
def send_notification():
    print("this is the task that is sending a notification")


@task(name='parse_instapaper_csv')
def parse_instapaper_csv(csv_list, email):
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        logging.warning('User {} does not exist'.format(email))
        return
    for item in csv_list:
        if item[3] == 'Unread':
            timestamp = int(item[4])
            dt_object = make_aware(datetime.fromtimestamp(timestamp))
            add_to_reading_list(user=user, link=item[0], date_added=dt_object)
    return


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

