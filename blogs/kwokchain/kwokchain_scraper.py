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
        permalink = latest_entry['links'][0]['href']
        time_struct = latest_entry['published_parsed']
        date_published = make_aware(datetime.fromtimestamp(mktime(time_struct)))
        author = "Kevin Kwok"
        content = latest_entry['content'][0]['value']
        article_id = id(permalink)
        s3_link = create_article_url(blog_name=self.name_id, article_id=article_id)

        if self.check_article(permalink):
            print("Article already exists, exit polling")

        current_blog = self.check_blog()

        try:
            upload_article(blog_name=self.name_id, article_id=article_id, content=content)
        except Exception as e:
            print(e)
            print("failed to upload article")
            return

        try:
            to_save = Article(title=title, date_published=date_published, author=author, permalink=permalink,
                          file_link=s3_link, blog=current_blog).save()
        except:
            print("article failed to save!")
            return

        return to_save

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

        path = "dump/bryan_caplan_econlib/{}.html".format(id)

        f = open(path, "w+")
        f.write(str(article))
        f.close()

        location = get_location(BUCKET_NAME)['LocationConstraint']

        object_url = "https://s3-{bucket_location}.amazonaws.com/{bucket_name}/{path}".format(
            bucket_location=location,
            bucket_name=BUCKET_NAME,
            path='bryan_caplan_econlib/{}.html'.format(id))

        current_blog = self.check_blog()

        to_save = Article(title=title, date_published=parsed_date, author=author, permalink=permalink,
                file_link=object_url, blog=current_blog)
        to_save.save()

        put_object(dest_bucket_name=BUCKET_NAME, dest_object_name='bryan_caplan_econlib/{}.html'.format(id),
                   src_data=path)

        return to_save


    def get_all_posts(self, page, year):
        pass