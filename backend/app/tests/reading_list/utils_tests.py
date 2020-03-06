from unittest import mock

from reading_list.utils import get_parsed, add_to_reading_list
from reading_list.models import Article, ReadingListItem
from django.contrib.auth.models import User

from django.core.cache import cache
from django.test import TestCase, override_settings
from django.core.exceptions import ValidationError
from model_bakery import baker
import vcr
from django_fakeredis import FakeRedis
import requests


class AddToReadingList(TestCase):

    @vcr.use_cassette('dump/AddToReadingList.yaml')
    @mock.patch('reading_list.tasks.handle_pages_task.delay')
    def setUp(self, mock_handle_pages_task):
        self.user = baker.make('User')
        self.permalink = 'http://paulgraham.com/ds.html'

        add_to_reading_list(self.user, self.permalink)
        self.assertTrue(mock_handle_pages_task.called)

    def test_add_invalid_url(self):
        brokenlink = 'http://brokenlink'
        with self.assertRaises(ValidationError):
            add_to_reading_list(self.user, brokenlink)

    # Test that add_to_reading_list succesfully saves an article
    def test_save_article(self):

        article, article_created = Article.objects.get_or_create(
            permalink=self.permalink
        )
        self.assertFalse(article_created)
        self.assertEquals(self.permalink, article.permalink)

    def test_save_reading_list(self):
        article = Article.objects.get(permalink=self.permalink)

        reading_list_item, created = ReadingListItem.objects.get_or_create(
            reader=self.user, article=article
        )

        self.assertFalse(created)
        self.assertEquals(reading_list_item.article, article)


class ParserTestCase(TestCase):

    def setUp(self):
        pass

    @override_settings(PARSER_HOST='localhost')
    @FakeRedis('django_redis.cache.RedisCache')
    @vcr.use_cassette('dump/test_get_parsed.yaml')
    def test_get_parsed(self):

        article = baker.make('reading_list.Article')
        # article.save()
        response = get_parsed(article.permalink)

        self.assertEquals(response, article.mercury_response)

    @override_settings(PARSER_HOST='localhost')
    def test_get_parsed_bad_url(self):
        brokenlink = 'http://brokenlink'
        with self.assertRaises(ValidationError):
            response = get_parsed(brokenlink)

    @override_settings(PARSER_HOST='websitedoesnotexist.com')
    def test_get_parsed_bad_connection(self):
        url = 'https://about.fb.com/news/2020/03/domain-name-lawsuit/'
        with self.assertRaises(requests.exceptions.RequestException):
            response = get_parsed(url)

    @FakeRedis('django_redis.cache.RedisCache')
    @mock.patch('django.core.cache.cache.get', return_value='success!')
    def test_get_parsed_redis(self, mock_cache_get):
        url = "https://about.fb.com/news/2020/03/domain-name-lawsuit/"
        Article.objects.create(
            title="redis article test",
            permalink=url,
            mercury_response="success!"
        )

        response = get_parsed(url)
        self.assertEquals(response, cache.get(url))