from celery import task
from celery import shared_task
import logging
from reading_list.reading_list_utils import add_to_reading_list
from datetime import datetime
from users.models import CustomUser


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
            dt_object = datetime.fromtimestamp(timestamp)
            add_to_reading_list(user=user, link=item[0], date_added=dt_object)
    return


@task(name='weekly_report')
def weekly_report():
    print("fired on the hour")
    # for blog in BLOGS:
    #      to_fire = blog()
    #      logging.warning("Celery firing {}".format(to_fire.name_id))
    #      to_fire.poll()
