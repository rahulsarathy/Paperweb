from celery import task
from users.models import CustomUser
import logging
from reading_list.models import Article, ReadingListItem
from celery import task
from celery import shared_task
import logging
from reading_list.reading_list_utils import add_to_reading_list, handle_pages
from datetime import datetime
from users.models import CustomUser
from django.utils.timezone import make_aware
from utils.s3_utils import check_file

@task(name='handle_pages')
def handle_pages_task(email, link):
    try:
        user = CustomUser.objects.get(email=email)
    except CustomUser.DoesNotExist:
        logging.warning('User {} does not exist'.format(email))
        return
    try:
        article = Article.objects.get(permalink=link)
    except Article.DoesNotExist:
        logging.warning('Article {} does not exist'.format(link))
        return
    handle_pages(user, article)
    return

@task(name='import_pocket')
def import_pocket(email, article_json):
    try:
        user = CustomUser.objects.get(email=email)
    except CustomUser.DoesNotExist:
        logging.warning('User {} does not exist'.format(email))
        return
    for key, article in article_json.items():
        permalink = article.get('given_url')
        unix_timestamp = article.get('time_added')
        timestamp = int(unix_timestamp)
        dt_object = make_aware(datetime.fromtimestamp(timestamp))
        add_to_reading_list(user, permalink, dt_object)
    return

@shared_task
def send_notification():
    print('Here I\’m3')
    print("this is the task that is sending a notification")


@task(name='parse_instapaper_csv')
def parse_instapaper_csv(csv_list, email):
    try:
        user = CustomUser.objects.get(email=email)
    except CustomUser.DoesNotExist:
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
    users = CustomUser.objects.all()
    for user in users:
        create_user_magazine.delay(user.email)
    return

@task(name='create_user_magazine')
def create_user_magazine(email):
    try:
        user = CustomUser.objects.get(email=email)
    except CustomUser.DoesNotExist:
        logging.warning('User {} does not exist'.format(email))
        return
    reading_list_items = ReadingListItem.objects.filter(reader=user)
    total = 0
    staged = []

    # Find out which articles we want to include in the magazine
    for item in reading_list_items:
        if item.to_deliver:
            new_total = total + item.article.num_pages
            if new_total > 50:
                return
            staged.append(item)

    return

