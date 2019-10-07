from blogs.BlogInformation import BlogInformation
from blogs.models import Article, Blog
from urllib.request import urlopen, Request as req
import vcr
from datetime import datetime
from time import mktime
from bs4 import BeautifulSoup
import feedparser
from utils.s3_utils import get_object, put_object, upload_file, get_location, BUCKET_NAME, upload_article, create_article_url
from django.core.exceptions import ObjectDoesNotExist
from django.utils.timezone import make_aware
import logging

HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) '
                         'Chrome/41.0.2228.0 Safari/537.3'}

description = "Stratechery provides analysis of the strategy and business side of technology and media, and the " \
              "impact of technology on society. Weekly Articles are free, while three Daily Updates a week are for " \
              "subscribers only. Recommended by The New York Times as “one of the most interesting sources of " \
              "analysis on any subject”, Stratechery has subscribers from over 85 different countries, including" \
              " executives in both technology and industries impacted by technology, venture capitalists and " \
              "investors, and thousands of other people interested in understanding how and why the Internet is " \
              "changing everything."

AUTHORS = [
    {
        "name": "Ben Thompson",
        "bio": "Stratechery is written by me, Ben Thompson. I am based in Taipei, Taiwan, and am fully supported by "
               "my work at Stratechery. I’ve worked previously at Apple, Microsoft, and Automattic, where I focused "
               "on strategy, developer relations, and marketing for Apple University, Windows, and WordPress.com. "
               "I attended undergrad at the University of Wisconsin, received an MBA from Kellogg School of Management"
               " with a focus on strategy and marketing, and an MEM from McCormick Engineering school in Design and "
               "Innovation with a focus on human-centered design. I have been writing Stratechery since 2013, and it "
               "has been my full-time job since 2014.",
        "link": "https://en.wikipedia.org/wiki/Ben_Thompson_(writer)"
    }
]

def is_last_page(soup):

    navigation = soup.find('div', attrs={"class": "navigation"})

    next_li = navigation.find('li', attrs={"class": "pagination-next"})

    if next_li is None:
        return True

    return False

class Stratechery(BlogInformation):
    def __init__(self,
                 name_id="stratechery",
                 rss_url="https://stratechery.com/feed/",
                 home_url="https://stratechery.com", display_name="Stratechery", about=description,
                 about_link="https://stratechery.com/about/", authors=AUTHORS, image="stratechery",
                 categories=["technology"]):

        super().__init__(rss_url=rss_url, home_url=home_url, display_name=display_name, name_id=name_id, about=about,
                         about_link=about_link, authors=authors, image=image, categories=categories)

    def _get_old_urls(self):
        xml = feedparser.parse(self.rss_url)
        entries = xml.entries
        for entry in entries:
            permalink = entry.link
            if self.check_article(permalink):
                logging.warning("Already scraped {} for {}. exiting polling".format(permalink, self.name_id))
            title = entry.title
            author = entry.author
            date_published = make_aware(datetime.fromtimestamp(mktime(entry['published_parsed'])))
            content = entry['content'][0]['value']

            self.handle_s3(title=title, permalink=permalink, date_published=date_published, author=author,
                           content=content)

    def _poll(self):
        xml = feedparser.parse(self.rss_url)
        entries = xml.entries
        for entry in entries:
            permalink = entry.link
            if self.check_article(permalink):
                logging.warning("Already scraped {} for {}. exiting polling".format(permalink, self.name_id))
            title = entry.title
            author = entry.author
            date_published = make_aware(datetime.fromtimestamp(mktime(entry['published_parsed'])))
            content = entry['content'][0]['value']

            self.handle_s3(title=title, permalink=permalink, date_published=date_published, author=author,
                           content=content)

    # USE WITH PROXY FLEET TO PREVENT RATE LIMITS
    def get_all_posts(self, page):
        pass