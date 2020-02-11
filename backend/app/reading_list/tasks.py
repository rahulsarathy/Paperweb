from celery import task
from celery import shared_task
import logging

# We can have either registered task
@task(name='summary')
def send_import_summary():
     print("send summary")
     # Magic happens here ...
# or
@shared_task
def send_notification():
     print('Here I\’m')
     print("this is the task that is sending a notification")

@task(name='find_latest')
def find_latest():
     print("fired on the hour")
     # for blog in BLOGS:
     #      to_fire = blog()
     #      logging.warning("Celery firing {}".format(to_fire.name_id))
     #      to_fire.poll()

