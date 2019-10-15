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
Overcoming Bias began in November ’06 as a group blog on the general theme of how to move our beliefs closer to reality, in the face of our natural biases such as overconfidence and wishful thinking, and our bias to believe we have corrected for such biases, when we have done no such thing.

While we had a few dozen authors, most posts came from Robin Hanson and Eliezer Yudkowsky. The topics drifted more widely, and early in ’09 Eliezer moved to a new sister blog, Less Wrong. Robin then made this his wide-ranging personal blog for the next three years. In ’12, Robin wanted to cut back to make more time to write a book, and so Katja Grace, Rob Wiblin, and Carl Shulman joined as new-co-bloggers. In ’13, Robin decided he’d changed his work habits, and this went back to being a personal blog.
"""

AUTHORS = [
    {
        "name": "Robin Hanson",
        "bio": """Robin Dale Hanson is an associate professor of economics at George Mason University and a research associate at the Future of Humanity Institute of Oxford University. """,
        "link": "https://en.wikipedia.org/wiki/Robin_Hanson",
        "profile": "https://static.scientificamerican.com/blogs/cache/file/373FB0DB-1E95-48B0-BBC128C03EB2283E_source.jpg?w=590&h=800&20C6BC6A-AFBD-4BB5-8A207827A5CE9511",
    },
]

class OvercomingBias(BlogInformation):
    def __init__(self,
                 name_id="overcoming_bias",
                 rss_url="http://www.overcomingbias.com/feed",
                 home_url="http://www.overcomingbias.com/",
                 display_name="Overcoming Bias", about=description,
                 about_link="http://www.overcomingbias.com/about", authors=AUTHORS, image='overcoming_bias',
                 categories=["rationality", "economics"]):

        super().__init__(rss_url=rss_url, home_url=home_url, display_name=display_name, name_id=name_id, about=about,
                         about_link=about_link, authors=authors, image=image, categories=categories)


    def _poll(self):
        self.standard_rss_poll()

    def _get_old_urls(self):
        self.feedparser_get_old_urls()

    def parse_permalink(self, permalink):
        pass