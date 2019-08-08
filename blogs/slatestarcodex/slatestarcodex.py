from blogs import Scraper, Article
import vcr
from datetime import datetime
from time import mktime
import feedparser


def is_last_page(soup):

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

        article = unparsed_article.content[0].get('value', '')

        f = open('dump/slatestarcodex/slatestarcodex_single_article.html', 'w+')
        f.write(str(article))
        f.close()

        return Article(title=title, author=author, permalink=permalink,
                       date_published=date_published)

