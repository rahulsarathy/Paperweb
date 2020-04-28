

from twitter.models import TwitterCredentials

from celery import task


@task(name='update_timelines')
def update_timelines():

	credentials = TwitterCredentials.objects.all()
	for credential in credentials:
		# get timeline with since

		pass
	return