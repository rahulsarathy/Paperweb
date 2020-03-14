from unittest import mock
import logging
# moto must be imported before any boto3 imports
import moto

from reading_list.tasks import handle_pages_task

from django.contrib.auth.models import User
from model_bakery import baker
from reading_list.models import Article
from reading_list.utils import handle_pages

import vcr
from django.test import TestCase, override_settings


class HandlePagesTaskTest(TestCase):

    def setUp(self):
        self.user = baker.make('User')

    def tearDown(self):
        Article.objects.all().delete()

    @mock.patch("logging.warning")
    def test_handle_pages_task_no_article(self, mock_logger):
        handle_pages_task("unknownarticle", self.user.email)
        mock_logger.assert_called_with("Article {} does not exist".format("unknownarticle"))

    @mock.patch("reading_list.tasks.handle_pages")
    def test_handle_pages_no_user(self, mock_handle_pages):
        my_article = baker.make('Article')
        handle_pages_task(my_article.permalink)
        mock_handle_pages.assert_called_with(my_article)

    @mock.patch("reading_list.tasks.handle_pages")
    def test_handle_pages_success(self, mock_handle_pages):
        my_article = baker.make('Article')
        handle_pages_task(my_article.permalink, self.user.email)
        mock_handle_pages.assert_called_with(my_article, self.user)

