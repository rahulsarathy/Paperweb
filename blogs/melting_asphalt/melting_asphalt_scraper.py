import vcr
from datetime import datetime
from time import mktime
from blogs.parsability import Scraper
from blogs.models import Article
import feedparser
from urllib.request import urlopen, Request as req
from bs4 import BeautifulSoup
from utils.s3_utils import get_object, put_object, upload_file, create_article_url
from django.utils.timezone import make_aware

HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) '
                         'Chrome/41.0.2228.0 Safari/537.3'}

def is_last_page(soup):

    return False

class MeltingAsphaltScraper(Scraper):
    def __init__(self,
                 name_id="melting_asphalt",
                 rss_url="https://meltingasphalt.com/feed",
                 home_url="https://meltingasphalt.com/"):

        super().__init__(name_id=name_id, rss_url=rss_url, home_url=home_url)

    def _poll(self):
        with vcr.use_cassette('dump/melting_asphalt/xml/melting_asphalt.yaml'):
            xml = feedparser.parse(self.rss_url)

        entries = xml['entries']
        latest_rss = entries[0]
        links = latest_rss.get('links')[0]
        permalink = links.get('href')

        self.parse_permalink(permalink)

    def parse_permalink(self, permalink):

        with vcr.use_cassette('dump/melting_asphalt/xml/melting_asphalt1.yaml'):
            to_send = req(url=permalink, headers=HEADERS)
        html = urlopen(to_send).read()

        soup = BeautifulSoup(html, 'html.parser')

        title = soup.find('h1', attrs={"class": "entry-title"}).string
        author = "Kevin Simler"
        date_string = soup.find('div', attrs={'class': "signature-line"}).string
        unparsed_date = date_string.split('Originally published ')[1].strip()
        parsed_date = datetime.strptime(unparsed_date, '%B %d, %Y.')
        aware_date = make_aware(parsed_date)
        article = soup.find('div', attrs={"class": "post-entry"})
        id = hash(permalink)
        local_path = "dump/melting_asphalt/{}.html".format(id)

        f = open(local_path, "w+")
        f.write(str(article))
        f.close()

        s3_url = create_article_url(self.name_id, id)
        current_blog = self.check_blog()

        path = '{blog_name}/{id}.html'.format(blog_name=self.name_id, id=id)

        if self.check_article(permalink):
            return

        Article(title=title, author=author, date_published=aware_date, permalink=permalink, file_link=s3_url,
                blog=current_blog).save()
        put_object(dest_bucket_name='pulpscrapedarticles', dest_object_name=path, src_data=local_path)
        return Article
