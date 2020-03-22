import moto

import vcr
from unittest import mock

from django.contrib.auth.models import User
from pocket.views import sync_pocket, request_pocket, authenticate_pocket, remove_pocket
from pocket.models import PocketCredentials
from django.core.cache import cache


from rest_framework.test import APIRequestFactory
from rest_framework.test import APITestCase
from rest_framework.test import force_authenticate
from rest_framework import status
from django.test import override_settings
from django.utils import timezone


class PocketViewsTestCase(APITestCase):

    def setUp(self):

        self.request_pocket = '/api/pocket/request_pocket'
        self.authenticate_pocket = '/api/pocket/authenticate_pocket'
        self.sync_pocket = '/api/pocket/sync_pocket'
        self.remove_pocket = '/api/pocket/remove_pocket'

        self.test_user = User.objects.create(
            email='rita@sarathy.org')
        self.factory = APIRequestFactory()

    def test_request_pocket_unauthenticated(self):

        request = self.factory.post(self.request_pocket)
        response = request_pocket(request)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    @mock.patch('pocket.views.get_pocket_code')
    def test_request_pocket(self, mock_get_pocket_code):
        mock_get_pocket_code.return_value = 'testcode'
        request = self.factory.post(self.request_pocket)
        force_authenticate(request, user=self.test_user)
        response = request_pocket(request)

        hostname = request.get_host()
        redirect_uri = 'http://{}/api/pocket/authenticate_pocket'.format(hostname)

        url = 'https://getpocket.com/auth/authorize?request_token={code}&redirect_uri=' \
              '{redirect_uri}'.format(code="testcode", redirect_uri=redirect_uri)

        decoded = response.content.decode('utf-8')
        self.assertEquals(decoded, url)


    @override_settings(CACHES={
        'default': {
            'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        }
    })
    @mock.patch('pocket.views.import_pocket.delay')
    @mock.patch('pocket.views.get_access_token')
    def test_authenticate_pocket(self, mock_get_access_token, mock_import_pocket):
        mock_get_access_token.return_value = "testtoken"
        self.assertRaises(PocketCredentials.DoesNotExist,
                          lambda: PocketCredentials.objects.get(owner=self.test_user))

        key = self.test_user.email + 'pocket'
        cache.set(key, 'testcode')
        request = self.factory.get(self.authenticate_pocket)
        force_authenticate(request, user=self.test_user)
        response = authenticate_pocket(request)
        self.assertEquals(response.status_code, status.HTTP_302_FOUND)
        updated_credentials = PocketCredentials.objects.get(owner=self.test_user)
        self.assertFalse(updated_credentials.invalid)
        self.assertEquals("testtoken", updated_credentials.token)
        mock_import_pocket.assert_called_with(self.test_user.email)

    def test_sync_pocket_no_credentials(self):
        request = self.factory.post(self.sync_pocket)
        force_authenticate(request, user=self.test_user)
        response = sync_pocket(request)
        self.assertEquals(response.status_code, 403)

    @mock.patch('pocket.views.timezone.now')
    @mock.patch('pocket.views.import_pocket.delay')
    def test_sync_pocket(self, mock_import_pocket, mock_timezone_now):
        PocketCredentials(owner=self.test_user).save()
        mock_timezone_now.return_value = "rightnow"
        request = self.factory.post(self.sync_pocket)
        force_authenticate(request, user=self.test_user)
        response = sync_pocket(request)
        decoded = response.content.decode('utf-8')
        self.assertEqual(decoded, '"rightnow"')
        mock_import_pocket.assert_called_with(self.test_user.email)
        self.assertEquals(response.status_code, 200)

    def test_remove_pocket(self):
        PocketCredentials(owner=self.test_user).save()

        request = self.factory.post(self.remove_pocket)
        force_authenticate(request, user=self.test_user)
        response = remove_pocket(request)
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        self.assertRaises(PocketCredentials.DoesNotExist,
                          lambda: PocketCredentials.objects.get(owner=self.test_user))
