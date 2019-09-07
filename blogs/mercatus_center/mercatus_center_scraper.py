from blogs.parsability import Scraper
from blogs.models import Article, Blog
from urllib.request import urlopen, Request as req
import vcr
from datetime import datetime
from time import mktime
from bs4 import BeautifulSoup
import feedparser
from utils.s3_utils import upload_article, create_article_url
from django.core.exceptions import ObjectDoesNotExist
import traceback
import re
import logging

HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) '
                         'Chrome/41.0.2228.0 Safari/537.3'}

KNOWN_PUBLICATIONS = ['commentary', 'regulation']

class MercatusCenterScraper(Scraper):
    def __init__(self,
                 name_id="mercatus_center",
                 rss_url="https://www.mercatus.org/feed",
                 home_url="https://www.mercatus.org/"):

        super().__init__(name_id=name_id, rss_url=rss_url, home_url=home_url)


    def _poll(self):
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) '
                                 'Chrome/41.0.2228.0 Safari/537.3'}

        with vcr.use_cassette('dump/mercatus/first.yaml'):
            xml = feedparser.parse(self.rss_url)
        # print(xml)
        unparsed_article = xml.entries[0]
        permalink = unparsed_article.link
        # print(permalink)
        # entries = xml.entries
        # # print(entries)
        # articles = []
        # for entry in entries:
        #     print(entry.links[0].href)

        # try:
        #     Article.objects.get(permalink=permalink)
        #     return
        # except ObjectDoesNotExist:
        #     pass

        self.parse_permalink(permalink)

    def parse_permalink(self, permalink):
        regex = r"https://www.mercatus.org/(?P<publication>\w+)/(?P<type>\w+)/"
        matched = re.match(regex, permalink)
        publication = matched.group('publication')
        print("publication is ", publication)
        category = matched.group('type')

        if category == 'podcasts':
            logging.warning("Skipping %s Scraper latest article because it is of type podcasts", self.name_id)
            return
        if category not in KNOWN_PUBLICATIONS:
            logging.warning("Skipping %s Scraper latest article because it is of unknown publication type",
                            self.name_id)
            return

        to_send = req(url=permalink, headers=HEADERS)
        html = urlopen(to_send).read()
        soup = BeautifulSoup(html, 'html.parser')

        if publication == 'bridge':
            self.parse_bridge(soup)
        if publication == 'publications':
            self.parse_publication()


        # author = soup.find('a', attrs={"rel": "author"}).text
        # unparsed_date = soup.find('span', attrs={"class": "date published time"}).get('title', None)
        # parsed_date = datetime.fromisoformat(unparsed_date)
        # title = soup.find('title').text
        # article = soup.find('div', attrs={"class": "entry-content"})
        # article.find('div', attrs={"class": "sharedaddy"}).decompose()
        # content = article
        #
        # self.handle_s3(title=title, permalink=permalink, date_published=parsed_date, author=author, content=content)

    def parse_bridge(self, soup):

        author_pane = soup.find('span', attrs={"class": "referenced-author"})
        author = author_pane.find('a').text

        title_pane = soup.find('div', attrs={"class": "pane-node-title"})
        title = title_pane.find('h2').text

        content_pane = soup.find('div', attrs={"class": "field-type-text-with-summary"})
        content = content_pane.find('div', attrs={"class": "field-item even"})

        print(content)

    def parse_publication(self):
        pass
