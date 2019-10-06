from celery import task
from celery import shared_task
from utils.blog_utils import BLOGS
import logging

# We can have either registered task
@task(name='summary')
def send_import_summary():
     print("send summary")
     # Magic happens here ...
# or
@shared_task
def send_notifiction():
     print('Here I\’m')
     # Another trick

@task(name='find_latest')
def find_latest():
     for blog in BLOGS:
          to_fire = blog()
          logging.warning("Firing {}".format(to_fire.name_id))
          to_fire.poll()