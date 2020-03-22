import moto

from unittest import mock
import vcr

from instapaper.views import authenticate_instapaper, remove_instapaper, sync_instapaper
from django.contrib.auth.models import User
from instapaper.models import InstapaperCredentials
from django.http import JsonResponse

from rest_framework import status
from rest_framework.test import APIRequestFactory
from rest_framework.test import APITestCase
from rest_framework.test import force_authenticate


class InstapaperViewsTest(APITestCase):

    def setUp(self):
        self.authenticate_instapaper = '/api/instapaper/authenticate_instapaper'
        self.remove_instapaper = '/api/instapaper/remove_instapaper'
        self.sync_instapaper = '/api/instapaper/sync_instapaper'

        self.test_user = User.objects.create(
            email='rita@sarathy.org')
        self.factory = APIRequestFactory()

    @vcr.use_cassette('instapaper/tests/__snapshots__/test_authenticate_instapaper_wrong_password.yaml')
    def test_authenticate_instapaper_wrong_password(self):
        """Checks that a authenticate_instapaper() with wrong instapaper credentials request returns 401."""

        request = self.factory.post(self.authenticate_instapaper,
                                    {'username': 'blah2@gmail.com', 'password': 'wrongpassword'})
        force_authenticate(request, user=self.test_user)
        response = authenticate_instapaper(request)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_unauthenticated_instapaper(self):
        """Checks that an unauthenticated authenticate_instapaper() request returns 403."""

        request = self.factory.post(self.authenticate_instapaper)
        response = authenticate_instapaper(request)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        self.assertRaises(InstapaperCredentials.DoesNotExist,
                          lambda: InstapaperCredentials.objects.get(owner=self.test_user))

    @vcr.use_cassette('instapaper/tests/__snapshots__/test_authenticate_instapaper.yaml')
    @mock.patch('instapaper.tasks.parse_instapaper_bookmarks.delay')
    def test_authenticate_instapaper(self, mock_parse_instapaper_csv):
        """Checks that an authenticated authenticate_instapaper() with good instapaper credentials request
         returns 200."""

        self.assertRaises(InstapaperCredentials.DoesNotExist,
                          lambda: InstapaperCredentials.objects.get(owner=self.test_user))

        # these credentials are legit on instapaper.
        request = self.factory.post(self.authenticate_instapaper,
                                    {'username': 'rahul@getpulp.io', 'password': 'pulptesting'})
        force_authenticate(request, user=self.test_user)
        response = authenticate_instapaper(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(mock_parse_instapaper_csv.called)

        self.assertIsNotNone(InstapaperCredentials.objects.get(owner=self.test_user))

    def test_remove_instapaper(self):
        """Checks that remove_instapaper removes a user's credentials
         returns 200."""

        credentials = InstapaperCredentials(owner=self.test_user).save()
        self.assertIsNotNone(InstapaperCredentials.objects.get(owner=self.test_user))

        # these credentials are legit on instapaper.
        request = self.factory.post(self.remove_instapaper)
        force_authenticate(request, user=self.test_user)
        response = remove_instapaper(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertRaises(InstapaperCredentials.DoesNotExist,
                          lambda: InstapaperCredentials.objects.get(owner=self.test_user))

    def test_unauthenticated_sync_instapaper(self):
        request = self.factory.post(self.sync_instapaper)
        response = sync_instapaper(request)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    @mock.patch('instapaper.views.parse_instapaper_bookmarks.delay')
    @mock.patch('instapaper.views.timezone.now')
    def test_sync_instapaper(self, mock_timezone_now, mock_parse_instapaper_bookmarks):
        # Test with no credentials
        request = self.factory.post(self.sync_instapaper)
        force_authenticate(request, user=self.test_user)
        response = sync_instapaper(request)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # Test with invalid credentials
        InstapaperCredentials(owner=self.test_user, invalid=True).save()

        request = self.factory.post(self.sync_instapaper)
        force_authenticate(request, user=self.test_user)
        response = sync_instapaper(request)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


        # Test with valid credentials
        request = self.factory.post(self.sync_instapaper)
        force_authenticate(request, user=self.test_user)
        credentials = InstapaperCredentials.objects.get(owner=self.test_user)
        credentials.invalid = False
        credentials.save()
        mock_timezone_now.return_value = "rightnow"
        response = sync_instapaper(request)
        decoded = response.content.decode('utf-8')
        mock_parse_instapaper_bookmarks.assert_called_with(self.test_user.email)
        self.assertEqual(decoded, '"rightnow"')