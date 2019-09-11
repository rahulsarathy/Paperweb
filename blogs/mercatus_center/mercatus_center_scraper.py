from datetime import datetime
import re
import logging

import feedparser
from bs4 import BeautifulSoup
import vcr
from urllib.request import urlopen, Request as req
from django.core.exceptions import ObjectDoesNotExist

from blogs.parsability import Scraper
from blogs.models import Article

HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) '
                         'Chrome/41.0.2228.0 Safari/537.3'}

KNOWN_CATEGORIES = ['commentary', 'regulation', None]
KNOWN_PUBLICATIONS = ['bridge', 'publications']

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
        unparsed_article = xml.entries[0]
        permalink = unparsed_article.link

        try:
            Article.objects.get(permalink=permalink)
            return
        except ObjectDoesNotExist:
            pass

        self.parse_permalink(permalink)

    def parse_permalink(self, permalink):
        print("permalink is", permalink)
        # Example URLS:
        # https://www.mercatus.org/bridge/commentary/we-shouldnt-demonize-digital-innovation-and-expand-administrative-state
        # https://www.mercatus.org/publications/regulation/snapshot-washington-dc-regulation-2019

        regex = r"https://www.mercatus.org/(?P<publication>\w+)(/(?P<category>\w+)/)?"
        matched = re.match(regex, permalink)
        category = matched.group('category')
        if category == 'podcasts':
            logging.warning("Skipping %s Scraper latest article because it is of type podcasts", self.name_id)
            return
        if category not in KNOWN_CATEGORIES:
            logging.warning("Skipping %s Scraper latest article because it is of unknown category: %s",
                            self.name_id, category)
            return
        publication = matched.group('publication')

        to_send = req(url=permalink, headers=HEADERS)
        html = urlopen(to_send).read()
        soup = BeautifulSoup(html, 'html.parser')

        if publication == 'bridge':
            self.parse_bridge(permalink, soup)
        elif publication == 'publications':
            self.parse_publication(permalink, soup)
        else:
            logging.warning("Skipping %s Scraper latest article because it is of unknown publication type: %s",
                            self.name_id, publication)

    def parse_bridge(self, permalink, soup, date_published=None):
        if not date_published:
            date_published_pane = soup.find('meta', attrs={"property": "article:published_time"})
            date_published_string = date_published_pane['content']
            date_published = datetime.fromisoformat(date_published_string)

        author_pane = soup.find('span', attrs={"class": "referenced-author"})
        author = author_pane.find('a').text

        title_pane = soup.find('div', attrs={"class": "pane-node-title"})
        title = title_pane.find('h2').text

        content_pane = soup.find('div', attrs={"class": "field-type-text-with-summary"})
        content = content_pane.find('div', attrs={"class": "field-item even"})

        self.handle_s3(title=title, permalink=permalink, date_published=date_published, author=author, content=content)

    def parse_publication(self, permalink, soup, date_published=None):
        if not date_published:
            date_published_pane = soup.find('meta', attrs={"property": "article:published_time"})
            date_published_string = date_published_pane['content']
            date_published = datetime.fromisoformat(date_published_string)

        author_pane = soup.find('div', attrs={"class": "pane-people-detailed"})

        title_pane = soup.find('div', attrs={"class": "pane-node-title"})
        title = title_pane.find('h2').text

        authors_unparsed = author_pane.findAll('h4', attrs={"class": "node-title"})
        authors = []
        for author in authors_unparsed:
            authors.append(self.hyperlink_strip(author))
        authors = ', '.join(authors)

        content_pane = soup.find('div', attrs={"class": "field-type-text-with-summary"})
        content = content_pane.find('div', attrs={"class": "field-item even"})

        self.handle_s3(title=title, permalink=permalink, date_published=date_published, author=authors, content=content)

    # For Mercatus, some of the authors have a hyperlink, and some do not. This method will account for this variation
    # and grab the author's name
    def hyperlink_strip(self, soup):
        if soup.find('a'):
            author = soup.find('a').text
            return author
        else:
            author = soup.text
            return author

    def parse_ppe(self, soup, date_published):

        author_pane = soup.find('div', attrs={"class": "field-name-field-people"})
        authors = author_pane.findall('li')
        print(authors)