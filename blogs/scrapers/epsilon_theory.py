from blogs.BlogInformation import BlogInformation
from django.utils.timezone import make_aware
import feedparser
from datetime import datetime
from time import mktime

description = """Epsilon Theory began in the spring of 2013 as a series of emails I wrote to myself and a few colleagues, trying to make sense of markets that didn’t make much sense. I decided to post a few of those emails online, and I cobbled together what I grandiosely called a Manifesto, proposing a new way of looking at investing and markets. Or rather, an old way of looking at investing and markets, one focused on behavior and history and strategic interactions, but with new tools, new energy and a new voice.

Today … six years and millions of pageviews later … I’m pleased to publish a new Manifesto – Clear Eyes, Full Hearts, Can’t Lose – to take Epsilon Theory in a new direction, to move from observation and commentary to action and teaching.

We are Second Foundation Partners, the publishers of Epsilon Theory, and we are committed to real change in the practice of investing and the practice of citizenship. We are a completely independent voice for change, with no obligation to anyone but our readers, our clients, and our partners – our pack.

We invite you to join us, not just because we can help you become a better investor, but because ALL of us can help ALL of us become better citizens. This is the power of the crowd watching the crowd. It builds cathedrals, it starts revolutions, and it darn sure moves markets. It’s the most powerful force in the social world, and we invite you to join us in figuring it out."""

AUTHORS = [
    {
        "name": "Ben Hunt",
        "bio": """ Ben Hunt is the creator of Epsilon Theory and inspiration behind Second Foundation Partners, which he co-founded with Rusty Guinn in June 2018.

Epsilon Theory, Second Foundation’s principal publishing brand, is a newsletter and website that examines markets through the lenses of game theory and history. Over 100,000 professional investors and allocators across 180 countries read Epsilon Theory for its fresh perspective and novel insights into market dynamics. As Chief Investment Officer, Ben bears primary responsibility for determining the Company’s investment views and positioning of model portfolios. He is also the primary author of materials distributed through Epsilon Theory.

Ben taught political science for 10 years: at New York University from 1991 until 1997 and (with tenure) at Southern Methodist University from 1997 until 2000. He also wrote two academic books: Getting to War (Univ. of Michigan Press, 1997) and Policy and Party Competition (Routledge, 1992), which he co-authored with Michael Laver. Ben is the founder of two technology companies and the co-founder of SmartEquip, Inc., a software company for the construction equipment industry that provides intelligent schematics and parts diagrams to facilitate e-commerce in spare parts.

He began his investment career in 2003, first in venture capital and subsequently on two long/short equity hedge funds. He worked at Iridian Asset Management from 2006 until 2011 and TIG Advisors from 2012 until 2013. He joined Rusty at Salient in 2013, where he combined his background as a portfolio manager, risk manager, and entrepreneur with academic experience in game theory and econometrics to work with Salient’s own portfolio managers and its financial advisor clients to improve client outcomes.

Ben is a graduate of Vanderbilt University (1986) and earned his Ph.D. in Government from Harvard University in 1991. He lives in the wilds of Redding, CT on Little River Farm, where he personifies the dilettante farmer that has been a stock comedic character since Cicero's day. Luckily his wife, Jennifer, and four daughters, Harper, Hannah, Haven and Halle, are always there to save the day. Ben's hobbies include comic books, Alabama football, beekeeping, and humoring Rusty in trivia "competitions".""",
        "link": "https://www.epsilontheory.com/w-ben-hunt/",
        "profile": "https://static4.businessinsider.com/image/528a9683ecad047b71f098bf/ben-hunt.jpg",
    },
]

class EpsilonTheory(BlogInformation):
    def __init__(self,
                 name_id="epsilon_theory",
                 rss_url="https://www.epsilontheory.com/feed/",
                 home_url="https://www.epsilontheory.com/",
                 display_name="Epsilon Theory", about=description,
                 about_link="https://www.epsilontheory.com/we-are-second-foundation-partners/", authors=AUTHORS, image='epsilon_theory',
                 categories=["economics"]):

        super().__init__(rss_url=rss_url, home_url=home_url, display_name=display_name, name_id=name_id, about=about,
                         about_link=about_link, authors=authors, image=image, categories=categories)


    def _poll(self):
        xml = feedparser.parse(self.rss_url)
        latest_entry = xml['entries'][0]
        title = latest_entry['title']
        permalink = latest_entry['link']
        date_published = make_aware(datetime.fromtimestamp(mktime(latest_entry['published_parsed'])))
        author = latest_entry.author

        self.handle_s3(title=title, permalink=permalink, date_published=date_published, author=author)


    def _get_old_urls(self):
        xml = feedparser.parse(self.rss_url)
        entries = xml.entries
        for entry in entries:
            title = entry.title
            permalink = entry.link
            date_published = make_aware(datetime.fromtimestamp(mktime(entry['published_parsed'])))
            author = entry.author

            self.handle_s3(title=title, permalink=permalink, date_published=date_published, author=author,)

    def parse_permalink(self, permalink):
        pass