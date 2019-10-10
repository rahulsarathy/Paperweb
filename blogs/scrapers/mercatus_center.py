from datetime import datetime
import re
import logging

import feedparser
from bs4 import BeautifulSoup
import vcr
from urllib.request import urlopen, Request as req
from django.core.exceptions import ObjectDoesNotExist

from blogs.BlogInformation import BlogInformation
from blogs.models import Article

description = "The Mercatus Center at George Mason University is the world’s premier university source for " \
              "market-oriented ideas—bridging the gap between academic ideas and real-world problems."

AUTHORS = [
    {
        "name": "Tyler Cowen",
        "bio": "Holbert L. Harris Chair of Economics at George Mason University Distinguished Senior Fellow, F. A. "
               "Hayek Program for Advanced Study in Philosophy, Politics, and Economics Faculty Director, "
               "Mercatus Center",
        "link": "https://www.mercatus.org/scholars/tyler-cowen",
        "profile": "data:image/jpeg;base64,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"
    },
]


HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) '
                         'Chrome/41.0.2228.0 Safari/537.3'}

KNOWN_CATEGORIES = ['commentary', 'regulation', None]
KNOWN_PUBLICATIONS = ['bridge', 'publications']

class MercatusCenter(BlogInformation):
    def __init__(self,
                 name_id="mercatus_center",
                 rss_url="https://www.mercatus.org/feed",
                 home_url="https://www.mercatus.org/", display_name="Mercatus Center",
                 about=description, about_link="https://www.mercatus.org/about",
                 authors=AUTHORS, image="mercatus_center", categories=["economics"]):

        super().__init__(rss_url=rss_url, home_url=home_url, display_name=display_name, name_id=name_id, about=about,
                         about_link=about_link, authors=authors, image=image, categories=categories)

    def _poll(self):
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) '
                                 'Chrome/41.0.2228.0 Safari/537.3'}

        xml = feedparser.parse(self.rss_url)
        unparsed_article = xml.entries[0]
        permalink = unparsed_article.link

        try:
            Article.objects.get(permalink=permalink)
            return
        except ObjectDoesNotExist:
            pass

        self.parse_permalink(permalink)

    def _get_old_urls(self):
        xml = feedparser.parse(self.rss_url)
        entries = xml.entries
        for entry in entries:
            permalink = entry.link

            self.parse_permalink(permalink)

    def parse_permalink(self, permalink):
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
