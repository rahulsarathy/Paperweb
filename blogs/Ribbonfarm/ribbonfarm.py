from blogs.BlogInformation import BlogInformation
from blogs.models import Article, Blog
from urllib.request import urlopen, Request as req
import vcr
from datetime import datetime
from time import mktime
from bs4 import BeautifulSoup
import feedparser
from utils.s3_utils import upload_article, create_article_url
from django.core.exceptions import ObjectDoesNotExist
import traceback
import logging
from django.utils.timezone import make_aware

HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) '
                         'Chrome/41.0.2228.0 Safari/537.3'}

description = "Ribbonfarm is a longform blog devoted to unusual takes on both familiar and new themes. " \
              "What they call “refactored perception. Venkatesh Rao serves as Editor-in-Chief. Sarah Perry serves as " \
              "Contributing Editor. Kevin Simler, Joe Kelly, Carlos Bueno, Renee DiResta, and Taylor Pearson serve " \
              "as editors-at-large and comprise the Ribbonfarm Editorial Board."

AUTHOR_BIO = "Venkat started writing Ribbonfarm in 2007. His other writing includes Tempo, a book about " \
             "decision-making, and two ebooks, Be Slightly Evil and The Gervais Principle. He is also the creator " \
             "of the Breaking Smart binge-reading site and email newsletter. His writing can also be found at " \
             "Aeon magazine, The Atlantic, Information Week and Forbes. He lives in Seattle."

AUTHORS = [
    {
        "name": "Venkatesh Rao",
        "bio": "Venkat started writing Ribbonfarm in 2007. His other writing includes Tempo, a book about "
               "decision-making, and two ebooks, Be Slightly Evil and The Gervais Principle. He is also the creator "
               "of the Breaking Smart binge-reading site and email newsletter. His writing can also be found at Aeon "
               "magazine, The Atlantic, Information Week and Forbes. He lives in Seattle.",
        "link": "https://en.wikipedia.org/wiki/Venkatesh_Rao_(writer)",
        "profile": "https://206hwf3fj4w52u3br03fi242-wpengine.netdna-ssl.com/wp-content/uploads/2006/12/venkatProfilePicPanama-300x270.jpg",
    },
    {
        "name": "Sarah Perry",
        "bio": "Sarah began contributing to Ribbonfarm in 2015, and serves as Contributing Editor. She also blogs at "
               "The View from Hell. She is also the author of Every Cradle is a Grave, a book about the ethics of "
               "birth and suicide. She is based in Reno. ",
        "link": "https://twitter.com/sarahdoingthing?lang=en",
        "profile": "https://206hwf3fj4w52u3br03fi242-wpengine.netdna-ssl.com/wp-content/uploads/2006/12/sarahperry-225x300.jpg",
    }
]

def is_last_page(soup):

    navigation = soup.find('div', attrs={"class": "navigation"})

    next_li = navigation.find('li', attrs={"class": "pagination-next"})

    if next_li is None:
        return True

    return False

class Ribbonfarm(BlogInformation):
    def __init__(self,
                 name_id="ribbonfarm",
                 rss_url="https://www.ribbonfarm.com/feed/",
                 home_url="https://www.ribbonfarm.com",  display_name="Ribbonfarm", about=description,
                 about_link="https://www.ribbonfarm.com/about/",
                 authors=AUTHORS, image="ribbonfarm", categories=["rationality"]):

        super().__init__(rss_url=rss_url, home_url=home_url, display_name=display_name, name_id=name_id, about=about,
                         about_link=about_link, authors=authors, image=image, categories=categories)

    def _poll(self):
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) '
                                 'Chrome/41.0.2228.0 Safari/537.3'}
        xml = feedparser.parse(self.rss_url)
        unparsed_article = xml.entries[0]
        permalink = unparsed_article.link
        print(permalink)

        self.parse_permalink(permalink)

    def _get_old_urls(self):
        xml = feedparser.parse(self.rss_url)
        entries = xml.entries
        for entry in entries:
            permalink = entry.link

            if self.check_article(permalink):
                logging.warning("Already scraped {} for {}. exiting polling".format(permalink, self.name_id))
            self.parse_permalink(permalink)


    def parse_permalink(self, permalink):

        try:
            Article.objects.get(permalink=permalink)
            return
        except ObjectDoesNotExist:
            pass

        to_send = req(url=permalink, headers=HEADERS)
        html = urlopen(to_send).read()
        soup = BeautifulSoup(html, 'html.parser')

        author = soup.find('a', attrs={"rel": "author"}).text
        unparsed_date = soup.find('span', attrs={"class": "date published time"}).get('title', None)
        parsed_date = datetime.fromisoformat(unparsed_date)
        title = soup.find('title').text
        article = soup.find('div', attrs={"class": "entry-content"})
        article.find('div', attrs={"class": "sharedaddy"}).decompose()
        content = article

        self.handle_s3(title=title, permalink=permalink, date_published=parsed_date, author=author, content=content)

    # USE WITH PROXY FLEET TO PREVENT RATE LIMITS
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
