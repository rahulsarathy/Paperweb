import moto

from unittest import mock
import vcr

from instapaper.tasks import parse_instapaper_bookmarks, retrieve_bookmarks, handle_bookmark
from django.contrib.auth.models import User
from instapaper.models import InstapaperCredentials

from django.utils.timezone import now
from django.test import TestCase

oauth_token_secret = '1aaf21a5c1af4fa48dea8e973f1b8b7c'
oauth_token = '72fc7c835336464d83e9d2f418d99753'

class InstapaperTasksTests(TestCase):

    def setUp(self):

        self.test_user = User.objects.create(
            email='rita@sarathy.org')


    @mock.patch('instapaper.tasks.add_to_reading_list')
    @vcr.use_cassette('instapaper/tests/__snapshots__/test_handle_bookmark.yaml')
    def test_handle_bookmark(self, mock_add_to_reading_list):
        user_bookmark = {
            "username": "rahul@getpulp.io",
            "user_id": 7756081,
            "type": "user",
            "subscription_is_active": "0"
        }
        handle_bookmark(user_bookmark, self.test_user)
        assert not mock_add_to_reading_list.called

        bookmark = {
            "hash": "mE4M0dpz",
            "description": "Stay Healthy. Stay Data-Informed. https://ift.tt/2WkzUg2",
            "bookmark_id": 1287357119,
            "private_source": "",
            "title": "Stay Healthy. Stay Data-Informed.",
            "url": "https://medium.com/@joulee/stay-healthy-stay-data-informed-d62da66951d7",
            "progress_timestamp": 0,
            "time": 1584555442,
            "progress": 0.0,
            "starred": "0",
            "type": "bookmark"
        }

        handle_bookmark(bookmark, self.test_user)
        assert mock_add_to_reading_list.called

    @vcr.use_cassette('instapaper/tests/__snapshots__/test_last_polled.yaml')
    def test_last_polled(self):
        credentials = InstapaperCredentials(owner=self.test_user, oauth_token=oauth_token,
                                            oauth_token_secret=oauth_token_secret)
        credentials.save()

        old_credentials = InstapaperCredentials.objects.get(owner=self.test_user)
        self.assertIsNone(old_credentials.last_polled)

        bookmarks = retrieve_bookmarks(credentials)

        updated_credentials = InstapaperCredentials.objects.get(owner=self.test_user)
        self.assertIsNotNone(updated_credentials.last_polled)


    @vcr.use_cassette('instapaper/tests/__snapshots__/test_instapaper_have.yaml')
    @mock.patch('instapaper.tasks.handle_bookmark')
    def test_instapaper_have(self, mock_handle_bookmark):
        """Checks that Instapaper does not return bookmarks we have already scraped from their API"""

        credentials = InstapaperCredentials(owner=self.test_user, oauth_token=oauth_token,
                                            oauth_token_secret=oauth_token_secret)
        credentials.save()

        parse_instapaper_bookmarks(self.test_user.email)

        updated_credentials = InstapaperCredentials.objects.get(owner=self.test_user)
        bookmarks = retrieve_bookmarks(updated_credentials)
        self.assertEqual(bookmarks[0].get('type'), 'meta')
        self.assertEqual(bookmarks[1].get('type'), 'user')
        self.assertEqual(len(bookmarks), 2)

    @vcr.use_cassette('instapaper/tests/__snapshots__/test_retrieve_bookmarks.yaml')
    def test_retrieve_bookmarks(self):
        credentials = InstapaperCredentials(owner=self.test_user, oauth_token=oauth_token,
                                            oauth_token_secret=oauth_token_secret)
        credentials.save()
        bookmarks = retrieve_bookmarks(credentials)
        self.assertEqual(bookmarks[0].get('type'), 'meta')
        self.assertEqual(bookmarks[1].get('type'), 'user')
        self.assertEqual(len(bookmarks), 134)

    @mock.patch("logging.warning")
    def test_polled_too_recently(self, mock_logger):

        credentials = InstapaperCredentials(owner=self.test_user, last_polled=now())
        credentials.save()
        result = parse_instapaper_bookmarks(self.test_user.email)
        mock_logger.assert_called_with("instapaper polled too recently")
        self.assertEquals(0, result)
