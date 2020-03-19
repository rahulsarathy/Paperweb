# moto must be imported before any boto3 imports
import moto

from unittest import mock
import json
import os
import logging

from moto import mock_s3

from reading_list.utils import get_parsed, add_to_reading_list, \
    get_page_count, contact_puppeteer, fill_article_fields, delegate_task, \
    html_to_s3, handle_pages, inject_json_into_html
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
from utils.s3_utils import get_article_id, put_object, check_file
import boto3
from botocore.exceptions import ClientError
from bs4 import BeautifulSoup


class AddToReadingListTestCase(TestCase):

    def setUp(self):

        self.url1 = 'http://paulgraham.com/ds.html'
        self.url2 = 'https://medium.com/@nic__carter/lessons-from-the-uneven-distribution-of-capital-ce665def00e6'
        self.url3 = 'http://www.espn.com/espn/feature/story/_/id/13035450/league-legends-' \
                    'prodigy-faker-carries-country-shoulders'

        self.user = baker.make('User')

    def tearDown(self):
        Article.objects.all().delete()

    def test_add_invalid_url(self):
        brokenlink = 'http://brokenlink'
        with self.assertRaises(ValidationError):
            add_to_reading_list(self.user, brokenlink)

    # Test that add_to_reading_list succesfully saves an article
    @vcr.use_cassette('reading_list/tests/__snapshots__/test_save_article.yaml')
    @mock.patch('reading_list.tasks.handle_pages_task')
    def test_save_article(self, mock_handle_pages_task):
        add_to_reading_list(self.user, self.url1)
        article, article_created = Article.objects.get_or_create(
            permalink=self.url1
        )
        self.assertFalse(article_created)
        self.assertEquals(self.url1, article.permalink)

    # Test that add_to_reading_list succesfully saves to reading list
    @vcr.use_cassette('reading_list/tests/__snapshots__/test_save_reading_list.yaml')
    @mock.patch('reading_list.tasks.handle_pages_task')
    def test_save_reading_list(self, mock_handle_pages_task):
        add_to_reading_list(self.user, self.url1)
        article = Article.objects.get(permalink=self.url1)

        reading_list_item, created = ReadingListItem.objects.get_or_create(
            reader=self.user, article=article
        )

        self.assertFalse(created)
        self.assertEquals(reading_list_item.article, article)

    # Test that fill_article_fields succesfully fills an article model's fields
    @vcr.use_cassette('reading_list/tests/__snapshots__/test_fill_article_fields.yaml')
    def test_fill_article_fields(self):
        article, article_created = fill_article_fields(self.url2)
        self.assertTrue(article_created)
        self.assertEquals(article.mercury_response.get('url'), self.url2)

    @vcr.use_cassette('reading_list/tests/__snapshots__/test_add_to_reading_list_with_date.yaml')
    @mock.patch('reading_list.utils.handle_pages')
    @mock.patch('reading_list.utils.delegate_task')
    @mock.patch('reading_list.utils.fill_article_fields')
    def test_add_to_reading_list_with_date(self, mock_fill_article_fields, mock_delegate_task, mock_handle_pages):
        my_article = baker.make('reading_list.Article')
        my_article.save()
        mock_fill_article_fields.return_value = my_article, False
        mock_delegate_task.return_value = False
        date_object = timezone.now()
        add_to_reading_list(self.user, self.url2, date_object)

        reading_list_item = ReadingListItem.objects.get(
            reader=self.user, article=my_article
        )

        self.assertEquals(reading_list_item.article.permalink, my_article.permalink)
        self.assertEquals(reading_list_item.date_added, date_object)

@mock_s3
class DelegateTaskTestCase(TestCase):

    def setUp(self):

        self.url1 = 'http://paulgraham.com/ds.html'
        self.url2 = 'https://medium.com/@nic__carter/lessons-from-the-uneven-distribution-of-capital-ce665def00e6'
        self.url3 = 'http://www.espn.com/espn/feature/story/_/id/13035450/league-legends-' \
                    'prodigy-faker-carries-country-shoulders'

        self.user = baker.make('User')
        createS3()

    def tearDown(self):
        deleteS3()
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

def createS3():
    s3_client = boto3.client(
        "s3",
        region_name="us-east-1",
        aws_access_key_id="fake_access_key",
        aws_secret_access_key="fake_secret_key",
    )

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

    return s3_client

def deleteS3():
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

@mock_s3
class S3BucketsTestCase(TestCase):

    def setUp(self):
        self.s3_client = createS3()

    def tearDown(self):
        deleteS3()

    @mock.patch('reading_list.utils.inject_json_into_html')
    def test_html_to_s3(self, mock_inject_json_into_html):
        mock_inject_json_into_html.return_value = "test html"
        my_article = baker.make('Article')
        my_article.save()

        my_article_id = get_article_id(my_article.permalink)
        article_key = "{}.html".format(my_article_id)
        html_to_s3(my_article)

        self.assertTrue(check_file(article_key, HTML_BUCKET))

    # call celery task because other two if conditions fail
    def test_call_celery_no_s3(self):
        my_article = baker.make('Article')
        my_article.page_count = 3
        article_created = False
        self.assertTrue(delegate_task(my_article, article_created))

    def test_no_call_celery(self):
        # Add article to S3 and check that delegate task returns false
        my_article = baker.make('Article')
        my_article.page_count = 3
        article_created = False
        article_id = get_article_id(my_article.permalink)
        article_key = "{}.html".format(article_id)
        f = open(article_key, "w+")
        f.write(str("test html"))
        f.close()
        put_object(HTML_BUCKET, article_key, article_key)
        os.remove(article_key)
        self.assertFalse(delegate_task(my_article, article_created))

        self.s3_client.download_file(HTML_BUCKET, article_key, article_key)
        f = open(article_key, "r").read()
        self.assertEquals(f, "test html")
        os.remove(article_key)

class BeautifulSoupTestCase(TestCase):

    def setUp(self):
        pass

    def tearDown(self):
        pass

    @mock.patch('reading_list.utils.get_parsed')
    def test_inject_json_into_html(self, mock_get_parsed):
        mock_get_parsed.return_value = {
            'content': '<div>mock_content</div>',
            'author': 'mock_author',
            'date_published': '2020-03-05T15:45:43.000Z',
            'title': 'mock_title',
            'domain': 'mock_domain',
        }
        my_article = baker.make('Article')
        validate_soup = inject_json_into_html(my_article)
        mock_get_parsed.assert_called_with(my_article.permalink)
        self.assertEquals(validate_soup.select_one('.title').string, 'mock_title')
        self.assertEquals(validate_soup.select_one('#author').string, 'By ' + 'mock_author')
        self.assertEquals(validate_soup.select_one('#date').string, 'Originally published on March 5, 2020')
        self.assertEquals(validate_soup.select_one('#domain').string, 'mock_domain')
        self.assertEquals(validate_soup.select_one('.main-content').string, 'mock_content')

    @mock.patch('reading_list.utils.get_parsed')
    def test_malformed_date(self, mock_get_parsed):
        mock_get_parsed.return_value = {
            'content': '<div>mock_content</div>',
            'author': 'mock_author',
            'date_published': '20d20-03-05T15:45:43.000Z',
            'title': 'mock_title',
            'domain': 'mock_domain',
        }

        my_article = baker.make('Article')
        validate_soup = inject_json_into_html(my_article)
        self.assertIsNone(validate_soup.select_one('#date').string)

    def test_template_is_clean(self):
        template_soup = BeautifulSoup(open('./pdf/template.html'), 'html.parser')
        self.assertIsNone(template_soup.select_one('.title').string)
        self.assertIsNone(template_soup.select_one('#author').string)
        self.assertIsNone(template_soup.select_one('#date').string)
        self.assertIsNone(template_soup.select_one('#domain').string)
        self.assertIsNone(template_soup.select_one('.main-content').string)


class DeliveryPagesTestCase(TestCase):

    def setUp(self):
        self.user = baker.make('User')
        self.user.save()

    def tearDown(self):
        Article.objects.all().delete()
        ReadingListItem.objects.all().delete()

    @mock.patch('reading_list.utils.get_page_count')
    @mock.patch("logging.warning")
    def test_get_page_count_returns_none(self, mock_logger, mock_get_page_count):
        mock_get_page_count.return_value = None

        my_article = baker.make('Article')
        my_article.save()
        handle_pages(my_article, self.user)
        mock_get_page_count.assert_called_with(my_article.permalink)
        mock_logger.assert_called_with("Puppeteer failed for {}".format(my_article.permalink))


    @mock.patch('reading_list.utils.get_page_count')
    def test_handle_pages_none(self, mock_get_page_count):
        mock_get_page_count.return_value = 3
        my_article = baker.make('Article')
        my_article.save()
        permalink = my_article.permalink
        handle_pages(my_article, self.user)
        mock_get_page_count.assert_called_with(permalink)


    def test_add_over_page_limit(self):
        for i in range(0, 9):
            my_article = baker.make('Article')
            my_article.page_count = 5
            my_article.save()
            handle_pages(my_article, self.user)

        rlist_items = ReadingListItem.objects.filter(reader=self.user)
        for rlist_item in rlist_items:
            self.assertTrue(rlist_item.to_deliver)

        overflow_article = baker.make('Article')
        overflow_article.page_count = 6
        overflow_article.save()
        handle_pages(overflow_article, self.user)
        overflow_rlist_item = ReadingListItem.objects.get(reader=self.user, article=overflow_article)
        self.assertFalse(overflow_rlist_item.to_deliver)

    def test_add_under_page_limit(self):
        for i in range(0, 10):
            my_article = baker.make('Article')
            my_article.page_count = 3
            my_article.save()
            # my_reading_list_item = ReadingListItem(reader=self.user, article=my_article)
            # my_reading_list_item.save()
            handle_pages(my_article, self.user)

        rlist_items = ReadingListItem.objects.filter(reader=self.user)
        for rlist_item in rlist_items:
            self.assertTrue(rlist_item.to_deliver)

@mock_s3
class PagesTestCase(TestCase):

    def setUp(self):

        self.s3_client = createS3()

        self.url1 = 'http://paulgraham.com/ds.html'
        self.url2 = 'https://medium.com/@nic__carter/lessons-from-the-uneven-distribution-of-capital-ce665def00e6'
        self.url3 = 'http://www.espn.com/espn/feature/story/_/id/13035450/league-legends-prodigy-faker-carries-country-shoulders'

    def tearDown(self):
        Article.objects.all().delete()
        deleteS3()

    @vcr.use_cassette('reading_list/tests/__snapshots__/test_get_page_count.yaml')
    def test_get_page_count(self):
        my_article = baker.make('reading_list.Article')
        my_article.permalink = self.url1
        my_article.save()
        article_id = get_article_id(self.url1)
        article_key = '{}.html'.format(article_id)
        path = os.path.join('reading_list', 'tests', 'html', article_key)
        put_object(HTML_BUCKET, article_key, path)
        pages = get_page_count(self.url1)
        self.assertEquals(6, pages)

        my_article = baker.make('reading_list.Article')
        my_article.permalink = self.url2
        my_article.save()
        article_id = get_article_id(self.url2)
        article_key = '{}.html'.format(article_id)
        path = os.path.join('reading_list', 'tests', 'html', article_key)
        put_object(HTML_BUCKET, article_key, path)
        pages = get_page_count(self.url2)
        self.assertEquals(7, pages)

        my_article = baker.make('reading_list.Article')
        my_article.permalink = self.url3
        my_article.save()
        article_id = get_article_id(self.url3)
        article_key = '{}.html'.format(article_id)
        path = os.path.join('reading_list', 'tests', 'html', article_key)
        put_object(HTML_BUCKET, article_key, path)
        pages = get_page_count(self.url3)
        self.assertEquals(4, pages)

    @vcr.use_cassette('reading_list/tests/__snapshots__/test_puppeteer_file_not_in_s3.yaml')
    def test_puppeteer_file_not_in_s3(self):
        article_id = get_article_id(self.url1)
        article_key = '{}.html'.format(article_id)
        self.assertFalse(check_file(article_key, HTML_BUCKET))

    @vcr.use_cassette('reading_list/tests/__snapshots__/test_puppeteer_bad_connection.yaml')
    @override_settings(PUPPETEER_HOST='localhost')
    @mock.patch('reading_list.utils.check_file', return_value=True)
    @mock.patch("logging.warning")
    def test_puppeteer_bad_connection(self, mock_logger, mock_check_file):
        pages = get_page_count(self.url1)
        mock_logger.assert_called_with("failed to connect to puppeteer for {}".format(self.url1))
        self.assertIsNone(pages)

    @mock.patch('reading_list.utils.check_file', return_value=True)
    @mock.patch("logging.warning")
    @mock.patch("reading_list.utils.contact_puppeteer")
    def test_puppeteer_malformed_json(self, mock_contact_puppeteer, mock_logger, mock_check_file):
        mock_contact_puppeteer.return_value.content = "malformed_json".encode('utf-8')
        pages = get_page_count(self.url1)
        self.assertIsNone(pages)
        mock_logger.assert_called_with("JSON decode error from {}".format("malformed_json"))

    @mock.patch('reading_list.utils.check_file')
    @mock.patch("logging.warning")
    @mock.patch("reading_list.utils.contact_puppeteer")
    def test_puppeteer_non_utf_8_response(self, mock_contact_puppeteer, mock_logger, mock_check_file):
        mock_check_file.return_value = True
        mock_contact_puppeteer.return_value.content = "malformed_string"
        pages = get_page_count(self.url1)
        self.assertIsNone(pages)
        mock_logger.assert_called_with("attribute error from {}".format(self.url1))


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

    @vcr.use_cassette('reading_list/tests/__snapshots__/test_get_parsed_from_mercury.yaml')
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
    @vcr.use_cassette('reading_list/tests/__snapshots__/test_set_parsed_redis.yaml')
    def test_set_parsed_redis(self):
        self.assertTrue(self.url not in cache)
        get_parsed(self.url)
        cache_response = cache.get(self.url)
        json_response = json.loads(cache_response)
        self.assertEquals(self.url, json_response.get('url', ''))
        self.assertEquals(self.title, json_response.get('title', ''))
