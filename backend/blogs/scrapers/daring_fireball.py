from blogs.BlogInformation import BlogInformation
import feedparser
from django.utils.timezone import make_aware
from datetime import datetime
from time import mktime


description = """Gruber has described his Daring Fireball writing as a "Mac column in the form of a weblog".[8] It was partly inspired by kottke.org and Jason Kottke.[9] The site is written in the form of a tumblelog called The Linked List, a linklog with brief commentary, in between occasional longform articles that discuss Apple products and issues in related consumer technology. Gruber often writes about user interfaces, software development, Mac applications, and Apple's media coverage."""

AUTHORS = [
    {
        "name": "John Gruber",
        "bio": """John Gruber (born 1973) is a writer, blog publisher, UI designer, and the inventor of the Markdown markup language""",
        "link": "https://en.wikipedia.org/wiki/John_Gruber",
    },
]

def is_last_page(soup):

    return False

class DaringFireball(BlogInformation):
    def __init__(self,
                 name_id="daring_fireball",
                 rss_url="https://daringfireball.net/feeds/main",
                 home_url="https://daringfireball.net/", display_name="Daring Fireball", about=description,
                 about_link="https://daringfireball.net/colophon/",
                 authors=AUTHORS, image="daring_fireball", categories=["technology"]):

        super().__init__(rss_url=rss_url, home_url=home_url, display_name=display_name, name_id=name_id, about=about,
                         about_link=about_link, authors=authors, image=image, categories=categories)

    def _get_old_urls(self):
        xml = feedparser.parse(self.rss_url)
        entries = xml['entries']
        for entry in entries:
            title = entry['title']
            permalink = entry['link']
            links = entry.links
            for link in links:
                if link.rel == 'related':
                    permalink = link.href
            date_published = make_aware(datetime.fromtimestamp(mktime(entry['published_parsed'])))
            author = entry['author']
            content = entry['content'][0]['value']

            self.handle_s3(title=title, permalink=permalink, date_published=date_published, author=author,
                           content=content)

    def _poll(self):
        xml = feedparser.parse(self.rss_url)
        entry = xml['entries'][0]
        title = entry['title']
        permalink = entry['link']
        links = entry.links
        for link in links:
            if link.rel == 'related':
                permalink = link.href
        date_published = make_aware(datetime.fromtimestamp(mktime(entry['published_parsed'])))
        author = entry['author']
        content = entry['content'][0]['value']

        self.handle_s3(title=title, permalink=permalink, date_published=date_published, author=author,
                       content=content)