from blogs.BlogInformation import BlogInformation
import vcr
from datetime import datetime
from time import mktime
import feedparser


def is_last_page(soup):


    return False

class MediumScraper(BlogInformation):
    def __init__(self,
                 name_id=None,
                 rss_url="https://medium.com/feed/@{username}",
                 home_url="https://medium.com/@{username}"):

        rss_url = rss_url.format(username=name_id)
        home_url = home_url.format(username=name_id)

        super().__init__(name_id=name_id, rss_url=rss_url, home_url=home_url)

        if not self.name_id:
            raise TypeError(
                "Medium scraper requires a valid username"
            )


    def _poll(self):

        with vcr.use_cassette('dump/medium/{}.yaml'.format(self.name_id)):
            xml = feedparser.parse(self.rss_url)

        print(xml)

        unparsed_article = xml.entries[1]

        article = unparsed_article.content[0].value

        title = unparsed_article.title

        permalink = unparsed_article.link

        author = unparsed_article.author

        unparsed_date = unparsed_article.published_parsed
        parsed_date = datetime.fromtimestamp(mktime(unparsed_date))

    def get_all_posts(self, page):
       pass


