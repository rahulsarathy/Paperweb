from blogs.parsability import Scraper
import vcr
from datetime import datetime
from time import mktime
import feedparser
from django.utils.timezone import make_aware



def is_last_page(soup):

    return False

class SlateStarCodexScraper(Scraper):
    def __init__(self,
                 name_id="slatestarcodex",
                 rss_url="https://slatestarcodex.com/feed",
                 home_url="https://slatestarcodex.com/"):

        super().__init__(name_id=name_id, rss_url=rss_url, home_url=home_url)


    def _poll(self):
        self.standard_rss_poll()