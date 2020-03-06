from unittest import mock
import json
import os
import logging

# moto must be imported before any boto3 imports
import moto
from moto import mock_s3

from reading_list.utils import get_parsed, add_to_reading_list, \
    get_page_count, contact_puppeteer, fill_article_fields, delegate_task
from reading_list.models import Article, ReadingListItem
from pulp.globals import HTML_BUCKET
from django.contrib.auth.models import User
from django.core.cache import cache

from django.test import TestCase, override_settings
from django.core.exceptions import ValidationError
from model_bakery import baker
import vcr
from django_fakeredis import FakeRedis
import requests
from django.utils import timezone
from utils.s3_utils import get_article_id, put_object
import boto3
from botocore.exceptions import ClientError


class AddToReadingList(TestCase):

    @vcr.use_cassette('dump/AddToReadingList.yaml')
    # mock celery task to prevent from being called
    @mock.patch('reading_list.tasks.handle_pages_task.delay')
    def setUp(self, mock_handle_pages_task):

        self.url1 = 'http://paulgraham.com/ds.html'
        self.url2 = 'https://medium.com/@nic__carter/lessons-from-the-uneven-distribution-of-capital-ce665def00e6'
        self.url3 = 'http://www.espn.com/espn/feature/story/_/id/13035450/league-legends-' \
                    'prodigy-faker-carries-country-shoulders'

        self.user = baker.make('User')

        add_to_reading_list(self.user, self.url1)

    def tearDown(self):
        Article.objects.all().delete()

    def test_add_invalid_url(self):
        brokenlink = 'http://brokenlink'
        with self.assertRaises(ValidationError):
            add_to_reading_list(self.user, brokenlink)

    # Test that add_to_reading_list succesfully saves an article
    def test_save_article(self):
        article, article_created = Article.objects.get_or_create(
            permalink=self.url1
        )
        self.assertFalse(article_created)
        self.assertEquals(self.url1, article.permalink)

    def test_save_reading_list(self):
        article = Article.objects.get(permalink=self.url1)

        reading_list_item, created = ReadingListItem.objects.get_or_create(
            reader=self.user, article=article
        )

        self.assertFalse(created)
        self.assertEquals(reading_list_item.article, article)

    @vcr.use_cassette('dump/test_fill_article_fields.yaml')
    def test_fill_article_fields(self):
        article, article_created = fill_article_fields(self.url2)
        self.assertTrue(article_created)
        self.assertEquals(article.mercury_response.get('url'), self.url2)

    @mock.patch('reading_list.tasks.handle_pages_task.delay')
    @mock.patch('reading_list.utils.fill_article_fields')
    def test_add_to_reading_list_with_date(self, mock_fill_article_fields,
                                           mock_handle_pages_task):
        my_article = baker.make('reading_list.Article')
        my_article.save()
        mock_fill_article_fields.return_value = my_article, False
        date_object = timezone.now()
        add_to_reading_list(self.user, self.url2, date_object)

        reading_list_item = ReadingListItem.objects.get(
            reader=self.user, article=my_article
        )

        self.assertEquals(reading_list_item.article.permalink, my_article.permalink)
        self.assertEquals(reading_list_item.date_added, date_object)

class TestDelegateTask(TestCase):

    def setUp(self):

        self.url1 = 'http://paulgraham.com/ds.html'
        self.url2 = 'https://medium.com/@nic__carter/lessons-from-the-uneven-distribution-of-capital-ce665def00e6'
        self.url3 = 'http://www.espn.com/espn/feature/story/_/id/13035450/league-legends-' \
                    'prodigy-faker-carries-country-shoulders'

        self.user = baker.make('User')

    def tearDown(self):
        Article.objects.all().delete()

    @mock.patch('reading_list.tasks.handle_pages_task.delay')
    def test_call_celery_no_page(self, mock_handle_pages_task):
        my_article = baker.make('Article')
        my_article.page_count = None
        should_delegate = delegate_task
        self.assertTrue(should_delegate)

    @mock.patch('reading_list.tasks.handle_pages_task.delay')
    def test_call_celery_articled_created(self, mock_handle_pages_task):
        my_article = baker.make('Article')
        self.assertTrue(delegate_task(my_article, True))

@mock_s3
class TestDelegateTaskS3(TestCase):

    def setUp(self):
        s3_client = boto3.client(
            "s3",
            region_name="us-east-1",
            aws_access_key_id="fake_access_key",
            aws_secret_access_key="fake_secret_key",
        )
        self.s3_client = s3_client

        try:
            s3 = boto3.resource(
                "s3",
                region_name="eu-west-1",
                aws_access_key_id="fake_access_key",
                aws_secret_access_key="fake_secret_key",
            )
            s3.meta.client.head_bucket(Bucket=HTML_BUCKET)
        except ClientError:
            pass
        else:
            err = "{bucket} should not exist.".format(bucket=HTML_BUCKET)
            raise EnvironmentError(err)

        s3_client.create_bucket(Bucket=HTML_BUCKET)


    def tearDown(self):
        s3 = boto3.resource(
            "s3",
            region_name="us-east-1",
            aws_access_key_id="fake_access_key",
            aws_secret_access_key="fake_secret_key",
        )
        bucket = s3.Bucket(HTML_BUCKET)
        for key in bucket.objects.all():
            key.delete()
        bucket.delete()

    @mock.patch('reading_list.tasks.handle_pages_task.delay')
    def test_call_celery_no_s3(self, mock_handle_pages_task):
        my_article = baker.make('Article')
        article_created = False
        self.assertTrue(my_article, article_created)

    @mock.patch('reading_list.tasks.handle_pages_task.delay')
    def test_no_call_celery(self, mock_handle_pages_task):
        my_article = baker.make('Article')
        article_created = False
        article_id = get_article_id(my_article.permalink)
        article_key = "./{}.html".format(article_id)
        f = open(article_key, "w+")
        f.write(str("test html"))
        f.close()
        put_object(HTML_BUCKET, article_key, article_key)
        os.remove(article_key)


class PagesTestCase(TestCase):

    def setUp(self):
        self.url1 = 'http://paulgraham.com/ds.html'
        self.url2 = 'https://medium.com/@nic__carter/lessons-from-the-uneven-distribution-of-capital-ce665def00e6'
        self.url3 = 'http://www.espn.com/espn/feature/story/_/id/13035450/league-legends-prodigy-faker-carries-country-shoulders'

    def tearDown(self):
        pass

    @vcr.use_cassette('dump/test_get_page_count.yaml')
    def test_get_page_count(self):
        pages = get_page_count(self.url1)
        self.assertEquals(6, pages)

        pages = get_page_count(self.url2)
        self.assertEquals(7, pages)

        pages = get_page_count(self.url3)
        self.assertEquals(4, pages)

    @vcr.use_cassette('dump/test_puppeteer_file_not_in_s3.yaml')
    def test_puppeteer_file_not_in_s3(self):
        fake_url = "thisisafakeurl"
        pages = get_page_count(fake_url)
        self.assertIsNone(pages)

    @vcr.use_cassette('dump/test_puppeteer_bad_connection.yaml')
    @override_settings(PUPPETEER_HOST='localhost')
    @mock.patch("logging.warning")
    def test_puppeteer_bad_connection(self, mock_logger):
        fake_url = "thisisafakeurl"
        pages = get_page_count(fake_url)
        mock_logger.assert_called_with("failed to connect to puppeteer for {}".format(fake_url))
        self.assertIsNone(pages)

    @mock.patch("logging.warning")
    @mock.patch("reading_list.utils.contact_puppeteer")
    def test_puppeteer_malformed_json(self, mock_contact_puppeteer, mock_logger):
        mock_contact_puppeteer.return_value.content = "malformed_json".encode('utf-8')
        pages = get_page_count('thisisafakeurl')
        self.assertIsNone(pages)
        mock_logger.assert_called_with("JSON decode error from {}".format("malformed_json"))

    @mock.patch("logging.warning")
    @mock.patch("reading_list.utils.contact_puppeteer")
    def test_puppeteer_non_utf_8_response(self, mock_contact_puppeteer, mock_logger):
        mock_contact_puppeteer.return_value.content = "malformed_string"
        pages = get_page_count('thisisafakeurl')
        self.assertIsNone(pages)
        mock_logger.assert_called_with("attribute error from {}".format('thisisafakeurl'))


@FakeRedis('reading_list.utils.cache')
class ParserTestCase(TestCase):

    def setUp(self):
        self.url = "https://about.fb.com/news/2020/03/domain-name-lawsuit/"
        self.title = 'Fighting Domain Name Fraud'

    # FakeRedis uses this as the cache
    @override_settings(CACHES={
        'default': {
            'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        }
    })
    def tearDown(self):
        cache.clear()
        Article.objects.all().delete()

    def test_get_parsed_from_database(self):
        article = baker.make('reading_list.Article')
        # article.save()
        response = get_parsed(article.permalink)

        self.assertEquals(response, article.mercury_response)

    @vcr.use_cassette('dump/test_get_parsed_from_mercury.yaml')
    def test_get_parsed_from_mercury(self):
        response = get_parsed(self.url)
        self.assertEquals(self.url, response.get('url', ''))
        self.assertEquals(self.title, response.get('title', ''))

    @override_settings(PARSER_HOST='localhost')
    def test_get_parsed_bad_url(self):
        brokenlink = 'http://brokenlink'
        with self.assertRaises(ValidationError):
            response = get_parsed(brokenlink)

    @override_settings(PARSER_HOST='websitedoesnotexist.com')
    def test_get_parsed_bad_connection(self):
        with self.assertRaises(requests.exceptions.RequestException):
            response = get_parsed(self.url)

    @override_settings(CACHES={
        'default': {
            'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        }
    })
    def test_get_parsed_redis(self):
        redis_set = {"success": True}
        redis_set_string = json.dumps(redis_set)
        cache.set(self.url, redis_set_string)
        response = get_parsed(self.url)
        self.assertEquals(response, {"success": True})

    @override_settings(CACHES={
        'default': {
            'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        }
    })
    @vcr.use_cassette('dump/test_set_parsed_redis.yaml')
    def test_set_parsed_redis(self):
        self.assertTrue(self.url not in cache)
        get_parsed(self.url)
        cache_response = cache.get(self.url)
        json_response = json.loads(cache_response)
        self.assertEquals(self.url, json_response.get('url', ''))
        self.assertEquals(self.title, json_response.get('title', ''))
