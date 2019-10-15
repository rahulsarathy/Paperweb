from blogs.BlogInformation import BlogInformation
from django.utils.timezone import make_aware
import feedparser
from datetime import datetime
from time import mktime

HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) '
                         'Chrome/41.0.2228.0 Safari/537.3'}

description = """LessWrong was founded in 2009 and relaunched in 2018 with a new codebase and full-time team.

We are a community dedicated to improving our reasoning and decision-making. We seek to hold true beliefs and to be effective at accomplishing our goals. More generally, we work to develop and practice the art of human rationality.[1]

To that end, LessWrong is a place to 1) develop and train rationality, and 2) apply one’s rationality to real-world problems.

LessWrong serves these purposes with its library of rationality writings, community discussion forum, open questions research platform, and community page for in-person events."""

AUTHORS = [
    {
        "name": "Eliezer Yudkowsky",
        "bio": """ Eliezer Shlomo Yudkowsky is an American AI researcher and writer best known for popularising the 
        idea of friendly artificial intelligence. He is a co-founder and research fellow at the Machine Intelligence
         Research Institute, a private research nonprofit based in Berkeley, California.""",
        "link": "https://en.wikipedia.org/wiki/Eliezer_Yudkowsky",
        "profile": "https://pbs.twimg.com/profile_images/706642709511966721/4cRlD__0_400x400.jpg",
    },
]

class LessWrong(BlogInformation):
    def __init__(self,
                 name_id="less_wrong",
                 rss_url="https://www.lesswrong.com/feed.xml?view=curated-rss",
                 home_url="https://www.lesswrong.com/",
                 display_name="Less Wrong", about=description,
                 about_link="https://www.lesswrong.com/about", authors=AUTHORS, image='less_wrong',
                 categories=["rationality"]):

        super().__init__(rss_url=rss_url, home_url=home_url, display_name=display_name, name_id=name_id, about=about,
                         about_link=about_link, authors=authors, image=image, categories=categories)


    def _poll(self):
        xml = feedparser.parse(self.rss_url)
        latest_entry = xml['entries'][0]
        title = latest_entry['title']
        permalink = latest_entry['link']
        date_published = make_aware(datetime.fromtimestamp(mktime(latest_entry['published_parsed'])))
        author = latest_entry['author']
        content = latest_entry.get('summary', None)

        self.handle_s3(title=title, permalink=permalink, date_published=date_published, author=author, content=content)


    def _get_old_urls(self):
        xml = feedparser.parse(self.rss_url)
        entries = xml.entries
        for entry in entries:
            title = entry.title
            permalink = entry.link
            date_published = make_aware(datetime.fromtimestamp(mktime(entry['published_parsed'])))
            author = entry.get('author')
            content = entry.get('summary', None)

            self.handle_s3(title=title, permalink=permalink, date_published=date_published, author=author,
                           content=content)

    def parse_permalink(self, permalink):
        pass