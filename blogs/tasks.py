from celery import task
from celery import shared_task
from utils.blog_utils import SCRAPERS
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
     for scraper in SCRAPERS:
          to_fire = scraper()
          logging.warning("Firing {}".format(to_fire.name_id))
          scraper().poll()