from blogs.parsability import Scraper
from blogs.models import Article, Blog
from urllib.request import urlopen, Request as req
import vcr
from datetime import datetime
from time import mktime
from bs4 import BeautifulSoup
import feedparser
from s3_utils.utils import get_object, put_object, upload_file, get_location, BUCKET_NAME
from django.core.exceptions import ObjectDoesNotExist

HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) '
                         'Chrome/41.0.2228.0 Safari/537.3'}

def is_last_page(soup):

    navigation = soup.find('div', attrs={"class": "navigation"})

    next_li = navigation.find('li', attrs={"class": "pagination-next"})

    if next_li is None:
        return True

    return False

class RibbonfarmScraper(Scraper):
    def __init__(self,
                 name="ribbonfarm",
                 rss_url="https://www.ribbonfarm.com/feed/",
                 home_url="https://www.ribbonfarm.com"):

        super().__init__(name=name, rss_url=rss_url, home_url=home_url)


    def _poll(self):
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) '
                                 'Chrome/41.0.2228.0 Safari/537.3'}
        xml = feedparser.parse(self.rss_url)
        unparsed_article = xml.entries[0]
        permalink = unparsed_article.link

        self.parse_permalink(permalink)


    def check_blog(self):
        try:
            current_blog = Blog.objects.get(name="Ribbon Farm")
        except:
            current_blog = Blog(name="Ribbon Farm",
                                last_polled_time=datetime.now(),
                                home_url="https://www.ribbonfarm.com/",
                                rss_url="https://www.ribbonfarm.com/feed/"
                                )
            current_blog.save()
        return current_blog


    def parse_permalink(self, permalink):

        try:
            Article.objects.get(permalink=permalink)
            return
        except ObjectDoesNotExist:
            pass

        toSend = req(url=permalink, headers=HEADERS)
        html = urlopen(toSend).read()
        soup = BeautifulSoup(html, 'html.parser')

        author = soup.find('a', attrs={"rel": "author"}).text
        unparsed_date = soup.find('span', attrs={"class": "date published time"}).get('title', None)
        parsed_date = datetime.fromisoformat(unparsed_date)
        title = soup.find('title').text
        article = soup.find('div', attrs={"class": "entry-content"})
        article.find('fieldset').decompose()
        article.find('div', attrs={"class": "sharedaddy"}).decompose()
        id = hash(permalink)

        path = "dump/ribbonfarm/{}.html".format(id)

        f = open(path, "w+")
        f.write(str(article))
        f.close()

        location = get_location(BUCKET_NAME)['LocationConstraint']

        object_url = "https://s3-{bucket_location}.amazonaws.com/{bucket_name}/{path}".format(
            bucket_location=location,
            bucket_name=BUCKET_NAME,
            path='ribbonfarm/{}.html'.format(id))

        current_blog = self.check_blog()

        Article(title=title, date_published=parsed_date, author=author, permalink=permalink,
                file_link=object_url, blog=current_blog).save()

        put_object(dest_bucket_name=BUCKET_NAME, dest_object_name='ribbonfarm/{}.html'.format(id),
                   src_data=path)

        return


    def get_all_posts(self, page):
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) '
                                 'Chrome/41.0.2228.0 Safari/537.3'}

        if page == 0:
            url = self.home_url
        else:
            url = "https://ribbonfarm.com/page/{}/".format(page)

        toSend = req(url=url, headers=headers)
        html = urlopen(toSend).read()
        soup = BeautifulSoup(html, 'html.parser')
        if is_last_page(soup):
            current_blog = self.check_blog()
            current_blog.scraped_old_posts = True
            current_blog.save()
            return
        posts = soup.findAll('a', attrs={"class": "entry-title-link"})

        for index, post in enumerate(posts):
            permalink = str(post.get('href', None))
            self.parse_permalink(permalink)

        self.get_all_posts(page + 1)
