from scrapers.parsability import Scraper, ParsabilityType, Article, Comment
from urllib.request import urlopen, Request as req
import vcr
from datetime import datetime
from time import mktime
from bs4 import BeautifulSoup
import feedparser


def is_last_page(soup):

    navigation = soup.find('div', attrs={"class": "navigation"})

    next_li = navigation.find('li', attrs={"class": "pagination-next"})

    if next_li is None:
        return True

    return False

class SlateStarCodex(Scraper):
    def __init__(self,
                 name="SlateStarCodex",
                 rss_url="https://slatestarcodex.com/feed",
                 home_url="https://slatestarcodex.com/"):

        super().__init__(name=name, rss_url=rss_url, home_url=home_url)


    def _poll(self):
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) '
                                 'Chrome/41.0.2228.0 Safari/537.3'}

        with vcr.use_cassette('dump/slatestarcodex/xml/slatestarcodex_xml.yaml'):
            xml = feedparser.parse(self.rss_url)

        unparsed_article = xml.entries[0]

        title = unparsed_article.title
        author = unparsed_article.author
        permalink = unparsed_article.link

        unparsed_date = unparsed_article.published_parsed
        date_published = datetime.fromtimestamp(mktime(unparsed_date))

        article = unparsed_article.content

        f = open('dump/slatestarcodex/slatestarcodex_single_article.html', 'w+')
        f.write(str(article))
        f.close()


        return Article(title=title, author=author, permalink=permalink,
                       date_published=date_published)

