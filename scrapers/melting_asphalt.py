from scrapers.parsability import Scraper, ParsabilityType, Article, Comment
from urllib.request import urlopen, Request as req
import vcr
from datetime import datetime
from time import mktime
from bs4 import BeautifulSoup
import feedparser


def is_last_page(soup):

    return False

class MeltingAsphalt(Scraper):
    def __init__(self,
                 name="Melting Asphalt",
                 rss_url="https://meltingasphalt.com/feed",
                 home_url="https://meltingasphalt.com/"):

        super().__init__(name=name, rss_url=rss_url, home_url=home_url)


    def _poll(self):
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) '
                                 'Chrome/41.0.2228.0 Safari/537.3'}

        with vcr.use_cassette('dump/melting_asphalt/xml/melting_asphalt.yaml'):
            xml = feedparser.parse(self.rss_url)

        unparsed_article = xml.entries[0]

        title = unparsed_article.title
        print(title)
        author = unparsed_article.author
        print(author)
        permalink = unparsed_article.link
        print(permalink)

        unparsed_date = unparsed_article.published_parsed
        date_published = datetime.fromtimestamp(mktime(unparsed_date))
        print(date_published)

        article = unparsed_article.content[0].get('value', '')

        f = open('dump/melting_asphalt/melting_asphalt_single_article.html', 'w+')
        f.write(str(article))
        f.close()

        return Article(title=title, author=author, permalink=permalink,
                       date_published=date_published)

