from blogs.BlogInformation import BlogInformation

HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) '
                         'Chrome/41.0.2228.0 Safari/537.3'}

description = """Hi. This is a collection of stuff that I read and do. I post it here so that I can find it again in the future."""

AUTHORS = [
    {
        "name": "Elaine Ou",
        "bio": """ Once upon a time, I was a PhD student at Stanford University. Then I was a Lecturer at the University of Sydney. Now I build things and try to stay out of trouble.

Sometimes I write stuff at Bloomberg Opinion.""",
        "link": "https://twitter.com/eiaine",
        "profile": "https://pbs.twimg.com/profile_images/3728968263/1723d0ea3304a367f1156c47af7ed488_400x400.jpeg",
    },
]

class ElaineOu(BlogInformation):
    def __init__(self,
                 name_id="elaine_ou",
                 rss_url="https://elaineou.com/feed/",
                 home_url="https://elaineou.com/",
                 display_name="Elaine Ou", about=description,
                 about_link="https://elaineou.com/about/", authors=AUTHORS, image='elaine_ou',
                 categories=["technology"]):

        super().__init__(rss_url=rss_url, home_url=home_url, display_name=display_name, name_id=name_id, about=about,
                         about_link=about_link, authors=authors, image=image, categories=categories)


    def _poll(self):
        self.standard_rss_poll()

    def _get_old_urls(self):
        self.feedparser_get_old_urls()