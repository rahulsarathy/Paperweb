from scrapers.parsability import Scraper, ParsabilityType
from urllib.request import urlopen, Request as req
from datetime import datetime
from bs4 import BeautifulSoup, CData

class RibbonfarmScraper(Scraper):
    def __init__(self,
                name="ribbonfarm",
                rss_url="http://www.ribbonfarm.com/feed/",
                 home_url="http://www.ribbonfarm.com"):

        super().__init__(name=name, rss_url=rss_url, home_url=home_url)

    def _poll(self):
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) '
                                 'Chrome/41.0.2228.0 Safari/537.3'}

        toSend = req(url=self.home_url, headers=headers)

        html = urlopen(toSend).read()

        print(html)

        pass