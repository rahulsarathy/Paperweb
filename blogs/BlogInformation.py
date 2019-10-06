import feedparser

from blogs.models import Blog as BlogModel, Article as ArticleModel
from utils.s3_utils import upload_article, create_article_url, check_file

from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist
from django.utils.timezone import make_aware

import logging
from datetime import datetime, timedelta, timezone
from time import mktime
import os
import traceback

class BlogInformation(object):

    def __init__(self, display_name, name_id, about, about_link, rss_url, home_url, authors, image, categories):

        self.display_name = display_name
        self.name_id = name_id
        self.about = about
        self.rss_url = rss_url
        self.home_url = home_url
        self.about_link = about_link
        self.authors = authors
        self.image = image
        self.categories = categories

    def to_json(self):
        return {
            'display_name': self.display_name,
            'name_id': self.name_id,
            'about': self.about,
            'about_link': self.about_link,
            'authors': self.authors,
            'image': self.image,
            'categories': self.categories,
        }

    def poll(self, *args, **kwargs):

        now = make_aware(datetime.now())

        if not (now - self.get_last_polled_time() > timedelta(hours=1)):
            logging.warning("Scraper {} polled too recently!".format(self.name_id))
            return

        latest_scrape = self.get_latest_url()
        latest_url = latest_scrape.get('permalink', None)
        latest_content = latest_scrape.get('content', None)
        if self.check_article(latest_url):
            logging.warning("Latest article already exists for {}".format(self.name_id))
            return
        if latest_content is not None:
            self.standard_rss_poll(latest_content)
        else:
            self._poll(*args, **kwargs)

        to_save = self.check_blog()

        to_save.last_polled_time = now
        to_save.save()

    def get_latest_url(self):
        raise Exception('Not Implemented')

    def check_blog(self):
        try:
            current_blog = BlogModel(name=self.name_id, last_polled_time=make_aware(datetime.now() - timedelta(days=4)),
                                     home_url=self.home_url, rss_url=self.rss_url)
            current_blog.save()
        except:
            current_blog = BlogModel.objects.get(name=self.name_id)

        return current_blog

    def check_article(self, permalink):
        try:
            ArticleModel.objects.get(permalink=permalink)
            return True
        except ObjectDoesNotExist:
            return False

    # Saves blog to S3 and to DB
    def handle_s3(self, title, permalink, date_published, author, content=None):
        bucket_name = 'pulpscrapedarticles'
        article_id = hash(permalink)
        s3_link = create_article_url(blog_name=self.name_id, article_id=article_id)

        if self.check_article(permalink):
            logging.warning("{} already is stored in DB.".format(permalink))
            return

        current_blog = self.check_blog()

        if content is not None:
            upload_article(blog_name=self.name_id, article_id=article_id, content=content, bucket_name=bucket_name)
            if not check_file(os.path.join(current_blog.name, '{}.html'.format(article_id)), bucket_name):
                logging.warning('Uploading to s3 failed. Not committing to DB')
                return

            to_save = ArticleModel(title=title, date_published=date_published, author=author, permalink=permalink,
                               file_link=s3_link, blog=current_blog)
            to_save.save()
        else:
            to_save = ArticleModel(title=title, date_published=date_published, author=author, permalink=permalink,
                               blog=current_blog)
            to_save.save()

        to_save = self.check_blog()
        to_save.save()

        logging.info("uploaded and saved {}".format(permalink))

        return to_save

    def standard_rss_poll(self, xml=None):
        if xml is None:
            xml = feedparser.parse(self.rss_url)
        latest_entry = xml['entries'][0]
        title = latest_entry['title']
        permalink = latest_entry['link']
        date_published = make_aware(datetime.fromtimestamp(mktime(latest_entry['published_parsed'])))
        author = latest_entry['author']
        content = latest_entry['content'][0]['value']

        self.handle_s3(title=title, permalink=permalink, date_published=date_published, author=author, content=content)

    def filter_short(self, content):
        pass

    def parse_permalink(self, permalink):
        raise Exception('Not Implemented')

    def get_all_posts(self, page):
        raise Exception('Not Implemented')

    def _poll(self, page):
        raise Exception('Not Implemented')

    def parse(self):
        pass

    def get_last_polled_time(self):
        try:
            check_blog = BlogModel.objects.get(name=self.name_id)
            last_polled_time = check_blog.last_polled_time
            return last_polled_time
        except:
            return make_aware(datetime.now() - timedelta(days=4))

class Article(object):

    def __init__(self, title=None, date_published=None, author=None, author_bio=None, author_profile_image=None,
                 comments=[], permalink=None, content_link=None):

        self.title = title
        self.date_published = date_published
        self.author = author
        self.author_bio = author_bio
        self.author_profile_image = author_profile_image
        self.comments = comments
        self.permalink= permalink
        self.content_link = content_link

    def to_json(self):
        return {
            'name': self.title,
            'date_published': self.date_published,
            'author': self.author,
            'author_bio': self.author_bio,
            'author_profile_image': self.author_profile_image,
            'comments': len(self.comments),
            'permalink': self.permalink,
            'content_link': self.content_link
        }

class Comment(object):
    def __init__(self, author="", content="", date_published=None, parent_comment=None):

        self.author = author
        self.content = content
        self.date_published = date_published
        self.parent_comment = parent_comment