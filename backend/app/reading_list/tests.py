from datetime import datetime
import json

from reading_list.models import Article
from reading_list.models import ReadingListItem
from reading_list.views import get_reading
from reading_list.views import remove_from_reading_list
from users.models import CustomUser

from django.utils.timezone import make_aware
from django_fakeredis import FakeRedis
from rest_framework import status
from rest_framework.test import APIRequestFactory
from rest_framework.test import APITestCase
from rest_framework.test import force_authenticate


class ReadingListTest(APITestCase):
  def setUp(self):
    self.test_user = CustomUser.objects.create(
        username='rsarathy', email='rita@sarathy.org')
    self.factory = APIRequestFactory()

    # class Article(models.Model):
    #     title = models.CharField(_('Article Title'), max_length=255)
    #     permalink = models.URLField(_('Permalink'), primary_key=True, max_length=500)
    #     word_count = models.IntegerField(_('Number of Words'), default=1, null=True)
    #     mercury_response = JSONField()
    self.article1 = Article.objects.create(
      title='Rent-Seeking and the York Marathon',
      permalink='rohit.sarathy.org/?p=439',
      word_count=2127,
      mercury_response={'success': 'true'}
    )
    self.reading_item1 = ReadingListItem.objects.create(
      reader=self.test_user,
      article=self.article1,
      date_added=make_aware(datetime(2019, 11, 26))
    )

    self.article2 = Article.objects.create(
      title='Too Much Dark Money In Almonds',
      permalink='https://slatestarcodex.com/2019/09/18/too-much-dark-money-in-almonds/',
      word_count=1825,
      mercury_response={'success': 'true'}
    )
    self.reading_item2 = ReadingListItem.objects.create(
      reader=self.test_user,
      article=self.article2,
      date_added=make_aware(datetime(2019, 9, 18))
    )
    # class ReadingListItem(models.Model):
    #     reader = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    #     article = models.ForeignKey(Article, on_delete=models.CASCADE, default=None, null=True)
    #     date_added = models.DateTimeField(_('Date Added'), default=timezone.now)
    #     archived = models.NullBooleanField(_('Archived'))
    #     trashed = models.NullBooleanField(_('Trashed'))
    #     delivered = models.NullBooleanField(_('Delivered'))
    #
    #     class Meta:
    #         unique_together = (("reader", "article"),)

  @FakeRedis('django_redis.cache.RedisCache')
  def test_get_reading(self):
    """
    Checks that a valid get_reading() request returns the appropriate
    ReadingListItem objects.
    """
    request = self.factory.get('/api/reading_list/get_reading')
    force_authenticate(request, user=self.test_user)
    response = get_reading(request)
    self.assertEqual(response.status_code, status.HTTP_200_OK)

    data = json.loads(response.content)
    self.assertEqual(len(data), 2)

    # The most recent ReadingListItem should be first...
    self.assertEqual(data[0]['article']['title'],
                     'Rent-Seeking and the York Marathon')
    self.assertTrue('2019-11-26' in data[0]['date_added'])

    # ...followed by the older ReadingListItem.
    self.assertEqual(data[1]['article']['title'],
                     'Too Much Dark Money In Almonds')
    self.assertTrue('2019-09-18' in data[1]['date_added'])

  def test_get_reading_unauthenticated(self):
    """Checks that an unauthenticated get_reading() request returns 403."""
    request = self.factory.get('/api/reading_list/get_reading')
    response = get_reading(request)
    self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

  @FakeRedis('django_redis.cache.RedisCache')
  def test_remove_from_reading_list(self):
    """
    Checks that remove_from_reading_list() correctly deletes a ReadingListItem
    from a user's reading list.
    """
    request = self.factory.post('/api/blogs/remove_reading',
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
    request = self.factory.post('/api/reading_list/remove_reading')
    response = remove_from_reading_list(request)
    self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

  def test_remove_from_reading_list_link_doesnt_exist(self):
    """
    Checks that remove_from_reading_list() returns 404 if a requested
    link for deletion doesn't exist within a user's reading list.
    """
    request = self.factory.post('/api/reading_list/remove_reading',
                                {'link': 'https://notnation.com'})
    force_authenticate(request, user=self.test_user)
    response = remove_from_reading_list(request)
    self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
