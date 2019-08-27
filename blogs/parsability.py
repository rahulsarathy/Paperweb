from enum import Enum
from datetime import datetime, timedelta, timezone
from blogs.models import Blog as BlogModel, Article as ArticleModel
from django.core.exceptions import ObjectDoesNotExist
from django.utils.timezone import make_aware
from utils.s3_utils import upload_article, create_article_url, check_file
import traceback
import feedparser
import os

class Scraper(object):

    def __init__(self, name_id, rss_url="", home_url="", username="",
                 author=""):

        self.name_id = name_id
        self.rss_url = rss_url
        self.last_polled_time = self.get_last_polled_time()
        self.home_url = home_url
        self.username = username
        self.author = author

    def poll(self, *args, **kwargs):
        print("polling..")
        print("last polled time is ", self.last_polled_time)

        now = make_aware(datetime.now())

        to_save = self.check_blog()
        to_save.save()

        if not (now - self.last_polled_time > timedelta(days=1)):
            print("Scraper polled too recently!")
            return

        try:
            self._poll(*args, **kwargs)
        except:
            "failed to poll"
            return

        to_save.last_polled_time = now
        to_save.save()

        #continue polling
        pass

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

    def handle_s3(self, title, permalink, date_published, author, content):
        article_id = hash(permalink)
        s3_link = create_article_url(blog_name=self.name_id, article_id=article_id)

        if self.check_article(permalink):
            print("Article already exists, exit polling")
            return

        current_blog = self.check_blog()

        upload_article(blog_name=self.name_id, article_id=article_id, content=content)

        if not check_file(os.path.join(current_blog.name, '{}.html'.format(article_id))):
            raise Exception('Uploading to s3 failed. Not committing to DB')
            return

        to_save = ArticleModel(title=title, date_published=date_published, author=author, permalink=permalink,
                          file_link=s3_link, blog=current_blog)
        to_save.save()

        to_save = self.check_blog()
        to_save.save()

        print("uploaded and saved")

        return to_save

    def standard_rss_poll(self):
        xml = feedparser.parse(self.rss_url)

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

    def to_json(self):
        return {

        }

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

    def add_comment(self, comment):

        self.comments.append(comment)
        return self.comments

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