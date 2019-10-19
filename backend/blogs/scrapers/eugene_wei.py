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

description = """
Remains of the Day is a personal blog started in 2001 covering a random assortment of topics of interest. That doesn't narrow things down much because I have both attention deficit and surplus.

Generally I roam over subjects like technology, product development, the internet, movies and filmmaking, photography, writing, and sports. 

As an Amazon Associate I earn from qualifying purchases. That’s how I cover costs of hosting this website and sending out the newsletter through Mailchimp.

There is an RSS feed for my blog if you're one of the few remaining people using newsreaders. For the rest of you, there's a newsletter containing all new posts, or just check back here often.
"""

AUTHORS = [
    {
        "name": "Eugene Wei",
        "bio": """ I live in San Francisco. Before that I lived in Los Angeles, New York, Seattle, and Chicago, where I grew up.

Most of my professional career has been spent at consumer internet companies. The world wide web was just heating up when I finished my undergrad education, and like many grads from Stanford, tech was always top of mind. I started off at Amazon.com and was there for seven years working on all sorts of things, but mostly product. I left Amazon to be a filmmaker, went to editing school at The Edit Center in NYC, then to UCLA Film School in their graduate directing program. But tech pulled me back in after just one year in film school. 

That summer I joined the company that would become Hulu, leading the product, design, editorial, and marketing teams. In 2011 I formed a startup called Erly with a few friends. We were purchased in 2012 by Airtime, and I left that in late 2012. I was the head of product at Flipboard for two years, then the Head of Video at Oculus, which I left in July 2017. I'm now working on some of my own ideas, most of which sit at the intersection of media and technology, as well as doing some advising and angel investing.

You can find more fragments of me scattered across the web at Twitter, Facebook, Instagram, and Letterboxd, among others.

You can also email me at eugene at eugenewei dot com.""",
        "link": "https://twitter.com/eugenewei",
        "profile": "https://i2.wp.com/radreads.co/wp-content/uploads/2018/03/eugene-cropped.jpeg?fit=1600%2C1201&ssl=1",
    },
]

class EugeneWei(BlogInformation):
    def __init__(self,
                 name_id="eugene_wei",
                 rss_url="https://eugene-wei.squarespace.com/blog?format=rss",
                 home_url="https://www.eugenewei.com/",
                 display_name="Remains of the Day", about=description,
                 about_link="https://www.eugenewei.com/info", authors=AUTHORS, image='eugene_wei',
                 categories=["technology"]):

        super().__init__(rss_url=rss_url, home_url=home_url, display_name=display_name, name_id=name_id, about=about,
                         about_link=about_link, authors=authors, image=image, categories=categories)


    def _poll(self):
        xml = feedparser.parse(self.rss_url)
        latest_entry = xml['entries'][0]
        title = latest_entry['title']
        permalink = latest_entry['link']
        if self.check_article(permalink):
            logging.warning("Already scraped {} for {}. exiting polling".format(permalink, self.name_id))

        date_published = make_aware(datetime.fromtimestamp(mktime(latest_entry['published_parsed'])))
        author = "Eugene Wei"
        content = latest_entry.get('summary', None)

        self.handle_s3(title=title, permalink=permalink, date_published=date_published, author=author, content=content)

    def _get_old_urls(self):
        xml = feedparser.parse(self.rss_url)
        entries = xml['entries']
        for entry in entries:
            title = entry.get('title', None)
            permalink = entry.get('link', None)
            date_published = make_aware(datetime.fromtimestamp(mktime(entry['published_parsed'])))
            author = "Eugene Wei"
            content = entry.get('summary', None)

            self.handle_s3(title=title, permalink=permalink, date_published=date_published, author=author,
                           content=content)

    def parse_permalink(self, permalink):
        pass