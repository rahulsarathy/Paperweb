from blogs.parsability import Scraper
from blogs.models import Article, Blog
from urllib.request import urlopen, Request as req
import vcr
from datetime import datetime
from time import mktime
from bs4 import BeautifulSoup
import feedparser
from utils.s3_utils import put_object, get_location, BUCKET_NAME, upload_article, create_article_url
from django.core.exceptions import ObjectDoesNotExist
from django.utils.timezone import make_aware
import logging


HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) '
                         'Chrome/41.0.2228.0 Safari/537.3'}


class KwokchainScraper(Scraper):
    def __init__(self,
                 name_id="kwokchain",
                 rss_url="https://kwokchain.com/feed",
                 home_url="https://kwokchain.com"):

        super().__init__(name_id=name_id, rss_url=rss_url, home_url=home_url)


    def _poll(self):
        xml = feedparser.parse(self.rss_url)
        latest_entry = xml['entries'][0]
        title = latest_entry['title']
        permalink = latest_entry['link']
        date_published = make_aware(datetime.fromtimestamp(mktime(latest_entry['published_parsed'])))
        author = "Kevin Kwok"
        content = latest_entry['content'][0]['value']

        self.handle_s3(title=title, permalink=permalink, date_published=date_published, author=author, content=content)

    def parse_permalink(self, permalink):

        try:
            article = Article.objects.get(permalink=permalink)
            return article
        except ObjectDoesNotExist:
            pass

        toSend = req(url=permalink, headers=HEADERS)

        html = urlopen(toSend).read()

        soup = BeautifulSoup(html, 'html.parser')

        by_author = soup.find('h5', attrs={'class': 'post-author'}).text
        author = by_author.replace('By ', '')
        unparsed_date = soup.find('meta', attrs={'property': 'article:modified_time'})
        parsed_date = datetime.fromisoformat(unparsed_date.get('content'))
        title = soup.find('title').text
        article = soup.find('div', attrs={'class': 'post-content'})

        id = hash(permalink)

        path = "dump/kwokchain/{}.html".format(id)

        f = open(path, "w+")
        f.write(str(article))
        f.close()

        location = get_location(BUCKET_NAME)['LocationConstraint']

        object_url = "https://s3-{bucket_location}.amazonaws.com/{bucket_name}/{path}".format(
            bucket_location=location,
            bucket_name=BUCKET_NAME,
            path='kwokchain/{}.html'.format(id))

        current_blog = self.check_blog()

        to_save = Article(title=title, date_published=parsed_date, author=author, permalink=permalink,
                file_link=object_url, blog=current_blog)
        to_save.save()

        put_object(dest_bucket_name=BUCKET_NAME, dest_object_name='kwokchain/{}.html'.format(id),
                   src_data=path)

        return to_save

    def get_last_posts(self, num_posts):
        xml = feedparser.parse(self.rss_url)
        entries = xml['entries']
        if num_posts > len(entries):
            logging.warning("Requested {} posts from {}, but only {} posts found".format(num_posts, self.name_id),
                            len(entries))
            num_posts = len(entries)

        author = "Kevin Kwok"
        for i in range(num_posts - 1):
            current_entry = entries[i]
            title = current_entry.get('title', None)
            permalink = current_entry.get('link', None)
            date_published = make_aware(datetime.fromtimestamp(mktime(current_entry.get('published_parsed', None))))
            content = current_entry['content'][0]['value']

            if title is None or permalink is None or date_published is None or content is None:
                continue
            self.handle_s3(title, permalink, date_published, author, content)

        logging.info("Scraped {} posts from {}".format(num_posts, self.name_id))

    def get_all_posts(self, page, year):
        pass