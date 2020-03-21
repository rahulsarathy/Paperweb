import moto

from unittest import mock
import vcr
from datetime import datetime

from pocket.tasks import sync_pocket, retrieve_pocket, add_from_pocket
from pocket.models import PocketCredentials

from django.contrib.auth.models import User
from django.utils import timezone

from django.test import TestCase


class PocketTasksTests(TestCase):

    def setUp(self):
        self.test_user = User.objects.create(
            email='rita@sarathy.org')

    @mock.patch('pocket.tasks.import_pocket.delay')
    def test_sync_pocket(self, mock_import_pocket):
        PocketCredentials(owner=self.test_user).save()
        sync_pocket()
        mock_import_pocket.assert_called_with(self.test_user.email)

    @vcr.use_cassette('pocket/tests/__snapshots__/test_retrieve_pocket.yaml')
    @mock.patch('pocket.tasks.timezone')
    def test_retrieve_pocket(self, mock_timezone):
        current_time = timezone.now()
        mock_timezone.now.return_value = current_time
        token = '8aabb187-be11-3c9c-9aff-817383'
        PocketCredentials(owner=self.test_user, token=token).save()
        articles = retrieve_pocket(self.test_user)

        updated_credentials = PocketCredentials.objects.get(owner=self.test_user)
        self.assertEquals(current_time, updated_credentials.last_polled)
        self.assertEquals(13, len(articles.items()))

    @vcr.use_cassette('pocket/tests/__snapshots__/test_retrieve_pocket_since.yaml')
    @mock.patch('pocket.tasks.timezone')
    def test_retrieve_pocket_since(self, mock_timezone):
        current_time = timezone.now()
        mock_timezone.now.return_value = current_time
        token = '8aabb187-be11-3c9c-9aff-817383'
        PocketCredentials(owner=self.test_user, token=token).save()
        retrieve_pocket(self.test_user)

        # call with since
        new_articles = retrieve_pocket(self.test_user)
        self.assertEquals([], new_articles)

    @vcr.use_cassette('pocket/tests/__snapshots__/test_retrieve_pocket_invalid.yaml')
    def test_retrieve_pocket_invalid(self):
        token = 'invalidtoken'
        PocketCredentials(owner=self.test_user, token=token).save()
        articles = retrieve_pocket(self.test_user)

        # call with since
        self.assertEquals([], articles)

        updated_credentials = PocketCredentials.objects.get(owner=self.test_user)
        self.assertTrue(updated_credentials.invalid)

    @mock.patch('pocket.tasks.add_to_reading_list')
    def test_add_from_pocket(self, mock_add_to_reading_list):
        article = {
            'given_url': 'https://blogs.scientificamerican.com/beautiful-minds/the-dark-core-of-personality/',
            'time_added': 1584692916,
        }

        permalink = article.get('given_url')
        unix_timestamp = article.get('time_added')
        timestamp = int(unix_timestamp)
        dt_object = timezone.make_aware(datetime.fromtimestamp(timestamp))
        add_from_pocket(self.test_user, article)
        mock_add_to_reading_list.assert_called_with(self.test_user, permalink, dt_object, False)
