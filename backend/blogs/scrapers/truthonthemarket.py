from blogs.BlogInformation import BlogInformation
from django.utils.timezone import make_aware
import feedparser
from datetime import datetime
from time import mktime

description = """We are a group of scholars, law professors, and/or economists who teach and write in the business law area, broadly defined, and including especially antitrust, industrial organization, and technology regulation. We launched Truth on the Market in January 2006 to provide the metaphysical subjective truth on abstract, concrete and invisible markets throughout the civilized world (whatever that means).

Truth on the Market offers commentary on law, business, economics and more. We hope you find some of our posts insightful, thought-provoking, or at least mildly interesting. """

AUTHORS = [
    {
        "name": "Dirk Auer",
        "bio": """ Dirk Auer joined ICLE as a Senior Fellow in October 2018. His work focuses on the law and economics of antitrust, with an emphasis on innovation policy, digital markets and European competition law. Dirk is also a guest lecturer at the EDHEC business school in France, where he teaches a course on advanced competition law, and at UCLouvain in Belgium, where he teaches an introduction to American law course.

Before joining ICLE, Dirk worked as a research fellow at the Liège Competition and Innovation Institute (LCII). During this time, he worked on a PhD which discusses the “innovation defense” under European and US antitrust laws. His dissertation concludes that competition enforcers should systematically assess whether their enforcement might chill firms’ incentives to innovate. Dirk’s research has been published in a number of influential law journals. Prior to that, he worked for the competition practices of two
leading law firms in Brussels.

Dirk holds a master’s degree in law from UCLouvain in Belgium. He also earned two LLMs, at the University of Liège and at University of Chicago Law School. During his PhD, Dirk completed several economics courses, focusing on industrial organization and competition policy. He also attended the IP² Summer Institute organized by Stanford University’s Hoover Institution. """,
        "link": "https://laweconcenter.org/author/dirkauer/",
        "profile": "https://laweconcenter.org/wp-content/uploads/2018/10/LCII-photo-2-2.jpg",
    },
    {
        "name": "Eric Fruits",
        "bio": """Eric Fruits, Ph.D. chief economist at the International Center for Law and Economics and an adjunct professor of economics at Portland State University, where he is also editor of the Center for Real Estate Quarterly Report.

He has written peer-reviewed articles on initial public offerings (IPOs), the municipal bond market, real estate markets, and the formation and operation of cartels. His economic analysis has been widely cited and has been published in The Economist, the Wall Street Journal, and a numerous metropolitan newspapers.

Dr. Fruits is an antitrust expert who has written articles on price fixing and cartels for the top-tier Journal of Law and Economics. He has assisted in the review of several mergers including Exxon-Mobil, BP-Arco, Nestle-Ralston, and Sysco-US Foods. He has worked on many antitrust lawsuits, including Weyerhaeuser v. Ross-Simmons, a predatory bidding case that was ultimately decided by the United States Supreme Court.

As an expert in statistics, Dr. Fruits has provided expert testimony regarding real estate transactions, profit projections, agricultural commodities, and war crimes allegations. His expert testimony has been submitted to state courts, federal courts, and an international court. """,
        "link": "https://laweconcenter.org/author/ericfruits/",
        "profile": "https://laweconcenter.org/wp-content/uploads/2017/09/fruits-bw.jpeg",
    },
]

class TruthOnTheMarket(BlogInformation):
    def __init__(self,
                 name_id="truthonthemarket",
                 rss_url="https://truthonthemarket.com/feed/",
                 home_url="https://truthonthemarket.com/",
                 display_name="Truth on The Market", about=description,
                 about_link="https://truthonthemarket.com/about-2/", authors=AUTHORS, image='truthonthemarket',
                 categories=["economics"]):

        super().__init__(rss_url=rss_url, home_url=home_url, display_name=display_name, name_id=name_id, about=about,
                         about_link=about_link, authors=authors, image=image, categories=categories)


    def _poll(self):
        self.standard_rss_poll()

    def _get_old_urls(self):
        self.feedparser_get_old_urls()

    def parse_permalink(self, permalink):
        pass