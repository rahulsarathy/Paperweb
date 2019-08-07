from apps.blogs import Scraper, Article
import vcr
from datetime import datetime
from time import mktime
import feedparser


def is_last_page(soup):


    return False

class MediumScraper(Scraper):
    def __init__(self,
                 name="Medium",
                 rss_url="https://medium.com/feed/@{}",
                 home_url="https://medium.com/",
                 username=None):

        super(MediumScraper, self).__init__(name=name, rss_url=rss_url, home_url=home_url, username=username)

        if not self.username:
            raise TypeError(
                "Medium scraper requires a valid username"
            )

        self.rss_url = rss_url.format(self.username)


    def _poll(self):

        with vcr.use_cassette('dump/medium/xml/medium.yaml'):
            xml = feedparser.parse(self.rss_url)

        unparsed_article = xml.entries[1]

        article = unparsed_article.content[0].value

        title = unparsed_article.title

        permalink = unparsed_article.link

        author = unparsed_article.author

        unparsed_date = unparsed_article.published_parsed
        parsed_date = datetime.fromtimestamp(mktime(unparsed_date))

        f = open("dump/medium/medium_single_article.html", "w+")
        f.write(str(article))
        f.close()

        return Article(title=title, date_published=parsed_date, author=author, permalink=permalink)


    def get_all_posts(self, page):
       pass


