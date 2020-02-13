from celery import task
from celery import shared_task
import logging
from reading_list.reading_list_utils import add_to_reading_list

# or
@shared_task
def send_notification():
     print('Here I\’m')
     print("this is the task that is sending a notification")


@task(name='parse_instapaper_csv')
def parse_instapaper_csv(csv_list, user):
     for item in csv_list:
          if item[3] == 'Unread':
               add_to_reading_list(user, item[0])



@task(name='weekly_report')
def weekly_report():
     print("fired on the hour")
     # for blog in BLOGS:
     #      to_fire = blog()
     #      logging.warning("Celery firing {}".format(to_fire.name_id))
     #      to_fire.poll()