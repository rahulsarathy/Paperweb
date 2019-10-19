from blogs.BlogInformation import BlogInformation
from django.utils.timezone import make_aware
import feedparser
from datetime import datetime
from time import mktime

description = """ Hi, I’m Sarah!

I’m trained as a mathematician (PhD from Yale, focusing on applied harmonic analysis.)  I’m currently working as a data scientist at a biotech company, doing machine learning for drug discovery.

I’m interested in questions related to “how do we know what we think we know?” This touches on machine learning, cognitive science, and philosophy. This blog is a place for exploring those kinds of issues, and other things that catch my fancy. """

AUTHORS = [
    {
        "name": "Sarah Constantin",
        "bio": """ Math/ML/data-science person now working on solving aging. Founder, LRI and Daphnia Labs. Discourse goes here. """,
        "link": "https://twitter.com/s_r_constantin",
        "profile": "https://pbs.twimg.com/profile_images/1130482462490894336/raAwYwQS.png",
    },
]

class Otium(BlogInformation):
    def __init__(self,
                 name_id="otium",
                 rss_url="https://srconstantin.wordpress.com/feed/",
                 home_url="https://srconstantin.wordpress.com/",
                 display_name="Otium", about=description,
                 about_link="https://srconstantin.wordpress.com/about/", authors=AUTHORS, image='otium',
                 categories=["rationality"]):

        super().__init__(rss_url=rss_url, home_url=home_url, display_name=display_name, name_id=name_id, about=about,
                         about_link=about_link, authors=authors, image=image, categories=categories)


    def _poll(self):
        xml = feedparser.parse(self.rss_url)
        latest_entry = xml['entries'][0]
        title = latest_entry['title']
        permalink = latest_entry['link']
        date_published = make_aware(datetime.fromtimestamp(mktime(latest_entry['published_parsed'])))
        author = "Sarah Constantin"
        content = latest_entry['content'][0]['value']

        self.handle_s3(title=title, permalink=permalink, date_published=date_published, author=author, content=content)


    def _get_old_urls(self):
        xml = feedparser.parse(self.rss_url)
        entries = xml.entries
        for entry in entries:
            title = entry.title
            permalink = entry.link
            date_published = make_aware(datetime.fromtimestamp(mktime(entry['published_parsed'])))
            author = "Sarah Constantin"
            content = entry.get('content')[0]['value']

            self.handle_s3(title=title, permalink=permalink, date_published=date_published, author=author,
                           content=content)

    def parse_permalink(self, permalink):
        pass