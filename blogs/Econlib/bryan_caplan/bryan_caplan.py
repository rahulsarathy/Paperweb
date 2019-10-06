from blogs.BlogInformation import BlogInformation
from blogs.models import Article, Blog
from urllib.request import urlopen, Request as req
import vcr
from datetime import datetime
from time import mktime
from bs4 import BeautifulSoup
import feedparser
from utils.s3_utils import get_object, put_object, upload_file, get_location, BUCKET_NAME
from django.core.exceptions import ObjectDoesNotExist
import logging
from django.utils.timezone import make_aware

description = "Bryan Caplan writes on topical economics of interest to them, illuminating subjects from politics and " \
              "finance, to recent films and cultural observations, to history and literature. EconLog aims to educate, " \
              "entice, and excite readers into thinking about economics in daily analyses.  " \
              "Readers are invited to comment."
AUTHORS = [
    {
        "name": "Bryan Caplan",
        "bio": "Bryan Caplan is an American economist and author. Caplan is a professor of economics at George Mason "
               "University, research fellow at the Mercatus Center, adjunct scholar at the Cato Institute, "
               "and frequent contributor to Freakonomics as well as publishing his own blog, EconLog.",
        "link": "",
        "profile": "https://i.imgur.com/J2Cwrdj.jpg"
    },
]

HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) '
                         'Chrome/41.0.2228.0 Safari/537.3'}


class BryanCaplanEconlib(BlogInformation):
    def __init__(self,
                 display_name="Bryan Caplan Econlib",
                 name_id="bryan_caplan_econlib",
                 about=description,
                 about_link="https://www.econlib.org/library/About.html",
                 authors=AUTHORS,
                 image="bryancaplan",
                 categories=["economics"],
                 rss_url="http://www.econlib.org/feed/indexCaplan_xml",
                 home_url="https://www.econlib.org/author/bcaplan/"):

        super().__init__(rss_url=rss_url, home_url=home_url, display_name=display_name, name_id=name_id, about=about,
                         about_link=about_link, authors=authors, image=image, categories=categories)

    def _poll(self):
        xml = feedparser.parse(self.rss_url)
        unparsed_article = xml.entries[0]
        permalink = unparsed_article.link

        if self.check_article(permalink):
            logging.warning("Already scraped {} for {}. exiting polling".format(permalink, self.name_id))

        title = unparsed_article.title
        date_published = make_aware(datetime.fromtimestamp(mktime(unparsed_article['published_parsed'])))
        content = unparsed_article.summary
        author = "Bryan Caplan"

        self.handle_s3(title=title, permalink=permalink, date_published=date_published, author=author, content=content)


    def _get_old_urls(self):
        entries = xml.entries
        for entry in entries:
            permalink = entry.link

            if self.check_article(permalink):
                logging.warning("Already scraped {} for {}. exiting polling".format(permalink, self.name_id))
            title = entry.title
            date_published = make_aware(datetime.fromtimestamp(mktime(entry['published_parsed'])))
            content = entry.summary
            author = "Bryan Caplan"

            self.handle_s3(title=title, permalink=permalink, date_published=date_published, author=author,
                           content=content)

    def parse_permalink(self, permalink):

        try:
            article = Article.objects.get(permalink=permalink)
            return article
        except ObjectDoesNotExist:
            pass

        to_send = req(url=permalink, headers=HEADERS)

        html = urlopen(to_send).read()

        soup = BeautifulSoup(html, 'html.parser')

        by_author = soup.find('h5', attrs={'class': 'post-author'}).text
        author = by_author.replace('By ', '')
        unparsed_date = soup.find('meta', attrs={'property': 'article:modified_time'})
        parsed_date = datetime.fromisoformat(unparsed_date.get('content'))
        title = soup.find('title').text
        article = soup.find('div', attrs={'class': 'post-content'})

        self.handle_s3(title=title, permalink=permalink, date_published=parsed_date, author=author, content=article)

    def get_all_posts(self, page, year):
        pass