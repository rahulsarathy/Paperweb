from datetime import datetime
import re
import logging

import feedparser
from django.core.exceptions import ObjectDoesNotExist

from blogs.BlogInformation import BlogInformation
from blogs.models import Article

description = """The Brookings Institution is an American research group founded in 1916 on Think Tank Row in Washington, D.C. It conducts research and education in the social sciences, primarily in economics, metropolitan policy, governance, foreign policy, and global economy and economic development."""

AUTHORS = [
    {

    },
]


HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) '
                         'Chrome/41.0.2228.0 Safari/537.3'}

class BrookingsInstitution(BlogInformation):
    def __init__(self,
                 name_id="brookings",
                 rss_url="http://webfeeds.brookings.edu/brookingsrss/topfeeds/latestfrombrookings?format=xml",
                 home_url="https://www.brookings.edu/", display_name="Brookings Institution",
                 about=description, about_link="https://www.brookings.edu/about-us/",
                 authors=AUTHORS, image="brookings", categories=["economics", "think tanks"]):

        super().__init__(rss_url=rss_url, home_url=home_url, display_name=display_name, name_id=name_id, about=about,
                         about_link=about_link, authors=authors, image=image, categories=categories)

    def _poll(self):
        self.standard_rss_poll()

    def _get_old_urls(self):
        self.feedparser_get_old_urls()
