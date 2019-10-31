from datetime import datetime
from django.utils.timezone import make_aware
from blogs.models import ReadingListItem
from blogs.views import get_reading_list
from blogs.views import remove_from_reading_list
import json
from users.models import CustomUser
from rest_framework import status
from rest_framework.test import APIRequestFactory
from rest_framework.test import APITestCase
from rest_framework.test import force_authenticate


# URL root for test cases.
TEST_ROOT = 'http://localhost:8000'

class BlogsTest(APITestCase):
  def setUp(self):
    self.test_user1 = CustomUser.objects.create(username='postlight', email='postlight@mercurynews.org')
    self.test_user2 = CustomUser.objects.create(username='rsarathy', email='rsarathy@google.com')
    ReadingListItem.objects.create(
      reader=self.test_user1,
      title='postlight/mercury-parser',
      link='https://github.com/postlight/mercury-parser',
      archived=False, trashed=False, delivered=False,
      date_added=make_aware(datetime.now())
    )
    ReadingListItem.objects.create(
      reader=self.test_user2,
      title='Google',
      link='https://www.google.com',
      archived=False, trashed=False, delivered=False,
      date_added=make_aware(datetime.now())
    )
    self.factory = APIRequestFactory()

  def test_get_reading_list(self):
    """Checks that get_reading_list() returns all of a user's ReadingListItem(s)."""
    request = self.factory.get('/api/blogs/get_reading/')
    force_authenticate(request, user=self.test_user1)
    response = get_reading_list(request)
    self.assertEqual(response.status_code, status.HTTP_200_OK)
    data = json.loads(response.content)

    # We should only find the ReadingListItems associated with `test_user1`.
    self.assertEqual(len(data), 1)
    self.assertEqual(data[0]['title'], 'postlight/mercury-parser')
    self.assertEqual(data[0]['link'], 'https://github.com/postlight/mercury-parser')

  def test_remove_from_reading_list(self):
    """
    Checks that remove_from_reading_list() correctly deletes a ReadingListItem
    from a user's reading list.
    """
    request = self.factory.post('/api/blogs/remove_reading', {'link': 'https://github.com/postlight/mercury-parser'})
    force_authenticate(request, user=self.test_user1)
    response = remove_from_reading_list(request)
    self.assertEqual(response.status_code, status.HTTP_200_OK)

    data = json.loads(response.content)
    self.assertEquals(len(data), 0)

  def test_remove_from_reading_list_link_doesnt_exist(self):
    """
    Checks that remove_from_reading_list() returns 404 if a requested
    link for deletion doesn't exist within a user's reading list.
    """
    request = self.factory.post('/api/blogs/remove_reading', {'link': 'https://notnation.com/'})
    force_authenticate(request, user=self.test_user1)
    response = remove_from_reading_list(request)
    self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
