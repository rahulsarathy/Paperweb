from blogs.BlogInformation import Blog

description = "Nassim Taleb's Medium blog where he blogs about probability (philosophy), probability (mathematics), " \
              "probability (logic),probability (reallife), deadlifts, Phoenician wine, dead languages"
AUTHORS = [
    {
        "name": "Nassim Taleb",
        "bio": "Nassim Nicholas Taleb is a Lebanese–American essayist, scholar, statistician, and former trader and "
               "risk analyst, whose work concerns problems of randomness, probability, and uncertainty. "
               "His 2007 book The Black Swan has been described by The Sunday Times as one of the twelve most "
               "influential books since World War II.[2]",
        "link": "https://en.wikipedia.org/wiki/Nassim_Nicholas_Taleb"
    },
]

class NassimTalebBlog(Blog):

    def __init__(self, name="Nassim Taleb", about=description, about_link="https://medium.com/@nntaleb",
                 authors=AUTHORS,):

        super().__init__(name=name, about=about, about_link=about_link, authors=authors, recent_posts=None,
                         frequency=None, color=None, font=None, scraper=None, image=None, categories=None)