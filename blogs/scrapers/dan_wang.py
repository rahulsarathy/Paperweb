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
I study technology at Gavekal Dragonomics, a global macro research firm based in Hong Kong and Beijing. For the most part, that means figuring out China’s technology capabilities and how quickly they’re improving. Broadly speaking, I’m trying to understand the East Asian industrialization story: the history and the path forward. I’m also a contributor to Bloomberg Opinion. I post essays on this site.

I’m currently living and working in Beijing. I’ve lived before in Kunming, Toronto, Ottawa, Philadelphia, Rochester, Freiburg im Breisgau, San Francisco, New York, and Hong Kong.  I’ve previously worked at Flexport, Shopify, Alcatel-Lucent, and the Philadelphia Museum of Art. I graduated from the University of Rochester with a double-major in philosophy and economics. For a happy while, I was a Royal Canadian Army Cadet.

Do reach out and say hi: danwyd@gmail.com and @danwwang. I’m a fan of the invitation posted on Patrick McKenzie’s site, and want to echo it: “I strongly prefer email as a communication method. I like getting email.”

The “secure transport of light” is one of my favorite phrases. It refers to both to optic cables (which make modern communications possible) and semiconductors (which make modern electronics possible). We can thank Alexander Graham Bell for allowing us to speak from one side of the Atlantic ocean to the other, through coils of sunbeams under the seas. Isn’t that a wonderful image?
"""

AUTHORS = [
    {
        "name": "Dang Wang",
        "bio": """Dan Wang is the Beijing-based technology analyst at Gavekal Dragonomics.""",
        "link": "https://twitter.com/danwwang",
        "profile": "https://pbs.twimg.com/profile_images/1121039666575233024/VVWTUzXf_400x400.jpg",
    },
]

class DanWang(BlogInformation):
    def __init__(self,
                 name_id="dan_wang",
                 rss_url="https://danwang.co/feed/",
                 home_url="https://danwang.co/",
                 display_name="Dan Wang", about=description,
                 about_link="https://danwang.co/about/", authors=AUTHORS, image='dan_wang',
                 categories=["economics", "technology"]):

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
        author = "Dan Wang"
        content = latest_entry['content'][0]['value']

        self.handle_s3(title=title, permalink=permalink, date_published=date_published, author=author, content=content)

    def _get_old_urls(self):
        xml = feedparser.parse(self.rss_url)
        entries = xml['entries']
        for entry in entries:
            title = entry.get('title', None)
            permalink = entry.get('link', None)
            date_published = make_aware(datetime.fromtimestamp(mktime(entry['published_parsed'])))
            author = "Dan Wang"
            content = entry['content'][0]['value']

            self.handle_s3(title=title, permalink=permalink, date_published=date_published, author=author,
                           content=content)

    def parse_permalink(self, permalink):
        pass