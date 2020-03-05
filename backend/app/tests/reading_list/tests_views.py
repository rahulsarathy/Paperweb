from datetime import datetime
import json
from unittest import mock
import requests
import vcr

from reading_list.models import Article
from reading_list.models import ReadingListItem
from reading_list.views import get_reading
from reading_list.views import handle_add_to_reading_list
from reading_list.views import remove_from_reading_list
from django.contrib.auth.models import User

from django.utils.timezone import make_aware
from django_fakeredis import FakeRedis
from rest_framework import status
from rest_framework.test import APIRequestFactory
from rest_framework.test import APITestCase
from rest_framework.test import force_authenticate


class ReadingListTest(APITestCase):

    def setUp(self):
        # API endpoints
        self.get_reading = '/api/reading_list/get_reading'
        self.add_reading = '/api/reading_list/add_reading'
        self.remove_reading = '/api/reading_list/remove_reading'

        self.get_archive = 'api/reading_list/get_archive'

        self.test_user = User.objects.create(
            email='rita@sarathy.org')
        self.factory = APIRequestFactory()

        mercury_response = {'lead_image_url': 'mock.png', 'author': 'pulptest'}

        self.article1 = Article.objects.create(
            title='Rent-Seeking and the New York Marathon',
            permalink='rohit.sarathy.org/?p=439',
            mercury_response=mercury_response
        )
        self.reading_item1 = ReadingListItem.objects.create(
            reader=self.test_user,
            article=self.article1,
            date_added=make_aware(datetime(2019, 11, 26))
        )

        self.article2 = Article.objects.create(
            title='Too Much Dark Money In Almonds',
            permalink='https://slatestarcodex.com/2019/09/18/too-much-dark-money-in-almonds/',
            mercury_response=mercury_response,
        )
        self.reading_item2 = ReadingListItem.objects.create(
            reader=self.test_user,
            article=self.article2,
            date_added=make_aware(datetime(2019, 9, 18))
        )

        self.article3 = Article.objects.create(
            title='Landmark Computer Science Proof Cascades Through Physics and Math',
            permalink='https://www.quantamagazine.org/landmark-computer-science-proof-cascades-through-physics-'
                      'and-math-20200304/',
            mercury_response=mercury_response,
        )
        self.reading_item3 = ReadingListItem.objects.create(
            reader=self.test_user,
            article=self.article3,
            date_added=make_aware(datetime(2019, 9, 18)),
            archived=True
        )

        self.to_add_link = 'https://slatestarcodex.com/2019/11/28/ssc-meetups-everywhere-retrospective/'

    def test_get_reading(self):
        """
        Checks that a valid get_reading() request returns the appropriate
        ReadingListItem objects.
        """
        request = self.factory.get(self.get_reading)
        force_authenticate(request, user=self.test_user)
        response = get_reading(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = json.loads(response.content)
        self.assertEqual(len(data), 2)

        # The most recent ReadingListItem should be first...
        self.assertEqual(data[0]['article']['title'],
                         'Rent-Seeking and the New York Marathon')
        self.assertTrue('2019-11-26' in data[0]['date_added'])

        # ...followed by the older ReadingListItem.
        self.assertEqual(data[1]['article']['title'],
                         'Too Much Dark Money In Almonds')
        self.assertTrue('2019-09-18' in data[1]['date_added'])

    def test_get_reading_unauthenticated(self):
        """Checks that an unauthenticated get_reading() request returns 403."""
        request = self.factory.get(self.get_reading)
        response = get_reading(request)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_reading_list_order(self):
        request = self.factory.get(self.get_reading)
        force_authenticate(request, user=self.test_user)
        response = get_reading(request)
        data = json.loads(response.content)
        dates = []
        for item in data:
            truncated_date_string = item['date_added'][:10]
            date_object = datetime.strptime(truncated_date_string, '%Y-%m-%d')
            dates.append(date_object)
        date_sorted = dates[:]
        # Newest dates should be first
        date_sorted.sort(reverse=True)
        self.assertEquals(date_sorted, dates)


    def test_remove_from_reading_list(self):
        """
        Checks that remove_from_reading_list() correctly deletes a ReadingListItem
        from a user's reading list.
        """
        request = self.factory.post(self.remove_reading,
                                    {'link': 'rohit.sarathy.org/?p=439'})
        force_authenticate(request, user=self.test_user)
        response = remove_from_reading_list(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # There should only be one article remaining.
        data = json.loads(response.content)
        self.assertEquals(len(data), 1)
        self.assertEqual(data[0]['article']['title'],
                         'Too Much Dark Money In Almonds')
        self.assertTrue('2019-09-18' in data[0]['date_added'])


    def test_remove_from_reading_list_unauthenticated(self):
        """
        Checks that an unauthenticated remove_from_reading_list() request
        returns 403.
        """
        request = self.factory.post(self.remove_reading)
        response = remove_from_reading_list(request)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


    def test_remove_from_reading_list_link_doesnt_exist(self):
        """
        Checks that remove_from_reading_list() returns 404 if a requested
        link for deletion doesn't exist within a user's reading list.
        """
        request = self.factory.post(self.remove_reading,
                                    {'link': 'https://notnation.com'})
        force_authenticate(request, user=self.test_user)
        response = remove_from_reading_list(request)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


    @FakeRedis('django_redis.cache.RedisCache')
    @vcr.use_cassette('dump/test_add_to_reading_list.yaml')
    def test_add_to_reading_list(self):
        request = self.factory.post(self.add_reading, {'link': self.to_add_link})
        force_authenticate(request, user=self.test_user)
        response = handle_add_to_reading_list(request)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = json.loads(response.content)
        self.assertEqual(len(data), 3)

        # The added article is the newest item in the reading list, so it should
        # be first.
        self.assertEqual(data[0]['article']['title'], 'SSC Meetups Everywhere Retrospective')
        self.assertEqual(data[1]['article']['title'], self.article1.title)
        self.assertEqual(data[2]['article']['title'], self.article2.title)


    def test_add_to_reading_list_unauthenticated(self):
        """
        Checks that an unauthenticated add_to_reading_list() request returns 403.
        """
        request = self.factory.post(self.add_reading)
        response = handle_add_to_reading_list(request)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


    def test_handle_add_to_reading_list_bad_link(self):
        """
        Checks that an add_to_reading_list() request with a bad link returns 400.
        """
        request = self.factory.post(self.add_reading, {'link': 'badlink//.com'})
        force_authenticate(request, user=self.test_user)
        response = handle_add_to_reading_list(request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


    def test_get_archive(self):
        pass


    def test_unarchive(self):
        pass


    def test_archive(self):
        pass
