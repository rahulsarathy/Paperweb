from celery import task
from users.models import CustomUser
import logging
from reading_list.models import Article
from celery import task
from celery import shared_task
import logging
from reading_list.reading_list_utils import add_to_reading_list, handle_pages
from datetime import datetime
from users.models import CustomUser
from django.utils.timezone import make_aware


@task(name='handle_pages')
def handle_pages_task(email, link):
    try:
        user = CustomUser.objects.get(email=email)
    except CustomUser.DoesNotExist:
        logging.warning('User {} does not exist'.format(email))
        return
    try:
        article = Article.objects.get(permalink=link)
    except CustomUser.DoesNotExist:
        logging.warning('Article {} does not exist'.format(link))
        return
    handle_pages(user, article)
    return

# or
@shared_task
def send_notification():
    print('Here I\’m2')
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