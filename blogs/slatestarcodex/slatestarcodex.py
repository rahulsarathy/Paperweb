from blogs.BlogInformation import BlogInformation
import vcr
from datetime import datetime
from time import mktime
import feedparser
from django.utils.timezone import make_aware

description = "Welcome to Slate Star Codex, a blog about science, medicine, philosophy, politics, and futurism."

AUTHORS = [
    {
        "name": "Scott Alexander",
        "bio": "SSC is the project of Scott Alexander, a psychiatrist on the US West Coast. You can email him at "
               "scott[at]slatestarcodex[dot]com. Note that emailing bloggers who say they are psychiatrists is a bad "
               "way to deal with your psychiatric emergencies, and you might wish to consider talking to your doctor "
               "or going to a hospital instead.",
        "link": "https://slatestarcodex.com/about/"
    },
]

def is_last_page(soup):

    return False

class SlateStarCodex(BlogInformation):
    def __init__(self,
                 name_id="slatestarcodex",
                 rss_url="https://slatestarcodex.com/feed",
                 home_url="https://slatestarcodex.com/", display_name="SlateStarCodex", about=description,
                 about_link="https://slatestarcodex.com/about/",
                 authors=AUTHORS, image="slatestarcodex", categories=["rationality"]):

        super().__init__(rss_url=rss_url, home_url=home_url, display_name=display_name, name_id=name_id, about=about,
                         about_link=about_link, authors=authors, image=image, categories=categories)

    def _poll(self):
        self.standard_rss_poll()