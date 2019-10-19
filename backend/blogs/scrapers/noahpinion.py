from blogs.BlogInformation import BlogInformation
from blogs.models import Article, Blog
from urllib.request import urlopen, Request as req
import vcr
from datetime import datetime
from time import mktime
from bs4 import BeautifulSoup
import feedparser
from utils.s3_utils import put_object, get_location, BUCKET_NAME, upload_article, create_article_url
from django.core.exceptions import ObjectDoesNotExist
from django.utils.timezone import make_aware
import logging


HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) '
                         'Chrome/41.0.2228.0 Safari/537.3'}

description = """ Economics, stale memes, and distraction from productive activity """

AUTHORS = [
    {
        "name": "Noah Smith",
        "bio": """Noah Smith is a Bloomberg Opinion columnist. He was an assistant professor of finance at Stony Brook University, and he blogs at Noahpinion. """,
        "link": "https://twitter.com/Noahpinion",
        "profile": "https://www.limaohio.com/wp-content/uploads/sites/54/2019/01/web1_Noah-Smith.jpg",
    },
]

class Noahpinion(BlogInformation):
    def __init__(self,
                 name_id="noahpinion",
                 rss_url="http://noahpinionblog.blogspot.com/feeds/posts/default",
                 home_url="http://noahpinionblog.blogspot.com",
                 display_name="Noahpinion", about=description,
                 about_link="https://www.bloomberg.com/opinion/authors/AR3OYuAmvcU/noah-smith", authors=AUTHORS, image='noahpinion',
                 categories=["economics"]):

        super().__init__(rss_url=rss_url, home_url=home_url, display_name=display_name, name_id=name_id, about=about,
                         about_link=about_link, authors=authors, image=image, categories=categories)


    def _poll(self):
        xml = feedparser.parse(self.rss_url)
        latest_entry = xml['entries'][0]
        title = latest_entry['title']
        permalink = latest_entry['link']
        date_published = make_aware(datetime.fromtimestamp(mktime(latest_entry['published_parsed'])))
        author = "Noah Smith"
        content = latest_entry['content'][0]['value']

        self.handle_s3(title=title, permalink=permalink, date_published=date_published, author=author, content=content)


    def _get_old_urls(self):
        xml = feedparser.parse(self.rss_url)
        entries = xml.entries
        for entry in entries:
            title = entry.title
            permalink = entry.link
            date_published = make_aware(datetime.fromtimestamp(mktime(entry['published_parsed'])))
            author = "Noah Smith"
            content = entry.get('content')[0]['value']

            self.handle_s3(title=title, permalink=permalink, date_published=date_published, author=author,
                           content=content)

    def parse_permalink(self, permalink):
        pass