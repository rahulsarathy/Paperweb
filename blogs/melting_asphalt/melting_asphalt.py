import vcr
from datetime import datetime
from time import mktime
from blogs.BlogInformation import BlogInformation
from blogs.models import Article
import feedparser
from urllib.request import urlopen, Request as req
from bs4 import BeautifulSoup
from utils.s3_utils import get_object, put_object, upload_file, create_article_url
from django.utils.timezone import make_aware

HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) '
                         'Chrome/41.0.2228.0 Safari/537.3'}

description = """
Kevin Simler started Melting Asphalt in 2012 as an exhaust pipe for my intellectual life and an excuse to practice 
the craft of writing. On both counts it's been a success. I still experience way too much psychic friction in 
getting posts out the door. But I've nevertheless managed to publish more than 300,000 words since starting 
this blog, which has had the intended effect: helping clear the way (prime the pump?) for even more ideas.
"""
AUTHORS = [
    {
        "name": "Kevin Simler",
        "bio": """
        Kevin Simler graduated from Berkeley in 2004 with degrees in Philosophy and Computer Science. I started a PhD in 
        Computational Linguistics at MIT, but left in 2006 to join Palantir Technologies — then (and always!) a 
        startup — where I worked for 7 years as an engineer, engineering manager, and product designer. 
        It was my professional coming-of-age and the experience of a lifetime. Hard to walk away from that, 
        but — what can I say? — I'm a restless millennial with other itches to scratch. I've since published a 
        book on social psychology (coauthored with Robin Hanson) and joined a very promising biotech startup.
        """,
        "link": "https://meltingasphalt.com/about/",
        "profile": "https://buster.wiki/images/people/kevin-simler.jpg",
    },
]

def is_last_page(soup):

    return False

class MeltingAsphalt(BlogInformation):

    def __init__(self, rss_url="https://meltingasphalt.com/feed", home_url="https://meltingasphalt.com/",
                 display_name="Melting Asphalt", name_id="melting_asphalt", about=description,
                 about_link="https://meltingasphalt.com/about/", authors=AUTHORS, image="melting_asphalt",
                 categories=["rationality"]):

        super().__init__(rss_url=rss_url, home_url=home_url, display_name=display_name, name_id=name_id, about=about,
                         about_link=about_link, authors=authors, image=image, categories=categories)

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
