import moto

from unittest import mock
import vcr

from instapaper.views import authenticate_instapaper
from instapaper.tasks import parse_instapaper_bookmarks
from django.contrib.auth.models import User

from rest_framework import status
from rest_framework.test import APIRequestFactory
from rest_framework.test import APITestCase
from rest_framework.test import force_authenticate


class InstapaperTest(APITestCase):

    def setUp(self):
        self.authenticate_instapaper = '/api/instapaper/authenticate_instapaper'

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

    @vcr.use_cassette('instapaper/tests/__snapshots__/authenticate_instapaper.yaml')
    @mock.patch('instapaper.tasks.parse_instapaper_bookmarks.delay')
    def test_authenticate_instapaper(self, mock_parse_instapaper_csv):
        """Checks that an authenticated authenticate_instapaper() with good instapaper credentials request
         returns 200."""

        # these credentials are legit on instapaper.
        request = self.factory.post(self.authenticate_instapaper,
                                    {'username': 'rahul@getpulp.io', 'password': 'pulptesting'})
        force_authenticate(request, user=self.test_user)
        response = authenticate_instapaper(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(mock_parse_instapaper_csv.called)