import moto

from unittest import mock
import vcr

from django.contrib.auth.models import User


from django.utils.timezone import now
from django.test import TestCase

class PocketTasksTests(TestCase):

    def setUp(self):

        self.test_user = User.objects.create(
            email='rita@sarathy.org')