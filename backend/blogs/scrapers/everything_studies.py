from blogs.BlogInformation import BlogInformation
import vcr
from datetime import datetime
from time import mktime
import feedparser
from django.utils.timezone import make_aware
import logging

description = """My title and tagline aren’t jokes. This blog is about everything, or at least everything my nerdy, hyperabstracted thinking style can be applied to.

I’m a thirty-something sociotechnical systems engineer with math, philosophy, history, computer science, economics, law, psychology, geography and social science under a shapeless academic belt. As a result my thoughts are mostly about how different fields of study, ways of thinking and people differ from each other and how some pattern somewhere looks like another pattern somewhere else.

If there was a real field called “Everything Studies” where you got to apply patterns to things and integrate models and theories from different fields into a “System of Systems”, I’d be all over it.

One thing I do focus my efforts on is erisology, a made up field that does part of what I’d wish “Everything Studies” would do. Erisology is about disagreement and argumentation (actual argumentation, not the idealized type you study in philosophy classes), drawing on many different fields to make sense of the complicated process that is verbal conflict. Such a field has become possible now since so much study material is available online (82% of everything on the internet is people arguing at each other and the rest is porn and cats). The conspicuous dysfunctionality of most of this cries out for explanation.

Most of my posts have some relev"""

AUTHORS = [
    {
        "name": "John Nerst",
        "bio": """big picture-fetishist | aspiring erisologist ("the study of disagreement") | lover and hater of words/philosophy/art | http://patreon.com/everythingstudies""",
        "link": "https://twitter.com/everytstudies"
    },
]

def is_last_page(soup):

    return False

class EverythingStudies(BlogInformation):
    def __init__(self,
                 name_id="everything_studies",
                 rss_url="https://everythingstudies.com/feed/",
                 home_url="https://everythingstudies.com/", display_name="Everything Studies", about=description,
                 about_link="https://everythingstudies.com/about/",
                 authors=AUTHORS, image="everythingstudies", categories=["rationality"]):

        super().__init__(rss_url=rss_url, home_url=home_url, display_name=display_name, name_id=name_id, about=about,
                         about_link=about_link, authors=authors, image=image, categories=categories)

    def _get_old_urls(self):
        xml = feedparser.parse(self.rss_url)
        entries = xml.entries
        for entry in entries:
            permalink = entry.link
            if self.check_article(permalink):
                logging.warning("Already scraped {} for {}. exiting polling".format(permalink, self.name_id))
            title = entry.title
            author = entry.author
            date_published = make_aware(datetime.fromtimestamp(mktime(entry['published_parsed'])))

            self.handle_s3(title=title, permalink=permalink, date_published=date_published, author=author)

    def _poll(self):
        xml = feedparser.parse(self.rss_url)
        newest_entry = xml.entries[0]
        title = newest_entry.title
        author = newest_entry.author
        permalink = newest_entry.link
        date_published = make_aware(datetime.fromtimestamp(mktime(newest_entry['published_parsed'])))
        self.handle_s3(title=title, permalink=permalink, date_published=date_published, author=author)