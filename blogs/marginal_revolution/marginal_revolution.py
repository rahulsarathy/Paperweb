from blogs.BlogInformation import BlogInformation
from blogs.models import Article, Blog
from urllib.request import urlopen, Request as req
import vcr
from datetime import datetime
from time import mktime
from bs4 import BeautifulSoup
import feedparser
from utils.s3_utils import get_object, put_object, upload_file, get_location, BUCKET_NAME, upload_article, create_article_url
from django.core.exceptions import ObjectDoesNotExist
from django.utils.timezone import make_aware

HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) '
                         'Chrome/41.0.2228.0 Safari/537.3'}

description = "The Mercatus Center at George Mason University is the world’s premier university source for " \
              "market-oriented ideas—bridging the gap between academic ideas and real-world problems."

AUTHORS = [
    {
        "name": "Tyler Cowen",
        "bio": "Tyler Cowen is Holbert L. Harris Professor of Economics at George Mason University and also Director"
               " of the Mercatus Center. He received his Ph.d. in economics from Harvard University in 1987. His book"
               " The Great Stagnation: How America Ate the Low-Hanging Fruit of Modern History, Got Sick, and Will "
               "(Eventually) Feel Better was a New York Times best-seller. He was recently named in an Economist poll "
               "as one of the most influential economists of the last decade and several years ago Bloomberg "
               "BusinessWeek dubbed him \"America's Hottest Economist.\" Foreign Policy magazine named him as one of "
               "its \"Top 100 Global Thinkers\" of 2011. His next book, about American business, is due out in 2019. "
               "He has blogged at Marginal Revolution every day for almost fifteen years.",
        "link": "https://marginalrevolution.com/marginalrevolution/author/tyler-cowen"
    },
    {
        "name": "Alex Tabarokk",
        "bio": "Alex Tabarrok is Bartley J. Madden Chair in Economics at the Mercatus Center and a professor of "
               "economics at George Mason University. Along with Tyler Cowen, he is the co-author of the popular "
               "economics blog Marginal Revolution and co-founder of Marginal Revolution University. He is the author"
               " of numerous academic papers in the fields of law and economics, criminology, regulatory policy, "
               "voting theory and other areas in political economy. He is co-author with Tyler of Modern Principles of "
               "Economics, a widely used introductory textbook. He gave a TED talk in 2009. His articles have appeared"
               " in the New York Times, the Washington Post, the Wall Street Journal, and many other publications.",
        "link": "https://marginalrevolution.com/about"
    }
]

def is_last_page(soup):

    navigation = soup.find('div', attrs={"class": "navigation"})

    next_li = navigation.find('li', attrs={"class": "pagination-next"})

    if next_li is None:
        return True

    return False

class MarginalRevolution(BlogInformation):
    def __init__(self,
                 name_id="marginal_revolution",
                 rss_url="http://feeds.feedburner.com/marginalrevolution/feed",
                 home_url="https://marginalrevolution.com/",
                 display_name="Marginal Revolution", about=description,
                 about_link="https://marginalrevolution.com/about",
                 authors=AUTHORS, image="marginal_revolution", categories=["economics"]):

        super().__init__(rss_url=rss_url, home_url=home_url, display_name=display_name, name_id=name_id, about=about,
                         about_link=about_link, authors=authors, image=image, categories=categories)

    def _poll(self):
        self.standard_rss_poll()

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
