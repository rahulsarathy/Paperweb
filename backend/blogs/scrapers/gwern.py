from blogs.BlogInformation import BlogInformation

# INCOMPLETE

HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) '
                         'Chrome/41.0.2228.0 Safari/537.3'}

description = """ The content here varies from statistics to psychology to self-experiments/Quantified Self to philosophy to poetry to programming to anime to investigations of online drug markets or leaked movie scripts (or two topics at once: anime & statistics or anime & criticism or heck anime & statistics & criticism!). It is everything I felt worth writing for the past few years that didn’t fit somewhere like Wikipedia or was already written—“…I realised that I wanted to read about them what I myself knew. More than this—what only I knew. Deprived of this possibility, I decided to write about them. Hence this book.”1 I never expected to write so much, but I discovered that once I had a hammer, nails were everywhere, and that supply creates its own demand2. I believe that someone who has been well-educated will think of something worth writing at least once a week; to a surprising extent, this has been true. (I added ~130 documents to this repository over the first 3 years.) There are many benefits to keeping notes as they allow one to accumulate confirming and especially contradictory evidence3, and even drafts can be useful so you Don’t Repeat Yourself or simply decently respect the opinions of mankind:"""

AUTHORS = [
    {
        "name": "Gwern Branwen",
        "bio": """ I am a freelance writer & researcher who lives in Virginia. (To make ends meet, I have a Patreon, benefit from Bitcoin appreciation thanks to some old coins, and live frugally.) I have worked for, published in, or consulted for: Wired (2015), MIRI/​SIAI2 (2012-2013), CFAR (2012), GiveWell (2017), the FBI (2016), A Global Village (2013), Cool Tools (2013), Quantimodo (2013), New World Encyclopedia (2006), Bitcoin Weekly (2011), Mobify (2013-2014), Bellroy (2013-2014), Dominic Frisby (2014), and private clients (2009-); everything on gwern.net should be considered my own viewpoint or writing unless otherwise specified by a representative or publication. I am currently not accepting new commissions.""",
        "link": "https://www.gwern.net/Links",
        "profile": "",
    },
]

class Gwern(BlogInformation):
    def __init__(self,
                 name_id="gwern",
                 rss_url="https://www.gwern.net/docs/personal/rss-subscriptions.opml",
                 home_url="https://www.gwern.net/",
                 display_name="Gwern", about=description,
                 about_link="https://www.gwern.net/About", authors=AUTHORS, image='gwern',
                 categories=["rationality"]):

        super().__init__(rss_url=rss_url, home_url=home_url, display_name=display_name, name_id=name_id, about=about,
                         about_link=about_link, authors=authors, image=image, categories=categories)


    def _poll(self):
        self.standard_rss_poll()

    def _get_old_urls(self):
        self.feedparser_get_old_urls()

    def parse_permalink(self, permalink):
        pass