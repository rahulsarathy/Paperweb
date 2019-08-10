from blogs.BlogInformation import Blog

description = "Bryan Caplan writes on topical economics of interest to them, illuminating subjects from politics and " \
              "finance, to recent films and cultural observations, to history and literature. EconLog aims to educate, " \
              "entice, and excite readers into thinking about economics in daily analyses.  " \
              "Readers are invited to comment."
AUTHORS = [
    {
        "name": "Bryan Caplan",
        "bio": "Bryan Caplan is an American economist and author. Caplan is a professor of economics at George Mason "
               "University, research fellow at the Mercatus Center, adjunct scholar at the Cato Institute, "
               "and frequent contributor to Freakonomics as well as publishing his own blog, EconLog.",
        "link": ""
    },
]

class BryanCaplanBlog(Blog):

    def __init__(self, name="Bryan Caplan", about=description, about_link="https://www.ribbonfarm.com/about/",
                 authors=AUTHORS, image="bryancaplan"):

        super().__init__(name=name, about=about, about_link=about_link, authors=authors, recent_posts=None,
                         frequency=None, color=None, font=None, scraper=None, image=image, categories=None)

