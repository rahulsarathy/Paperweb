from blogs.BlogInformation import Blog

description = "The Mercatus Center at George Mason University is the world’s premier university source for " \
              "market-oriented ideas—bridging the gap between academic ideas and real-world problems."

AUTHORS = [
    {
        "name": "Tyler Cowen",
        "bio": "Holbert L. Harris Chair of Economics at George Mason University Distinguished Senior Fellow, F. A. "
               "Hayek Program for Advanced Study in Philosophy, Politics, and Economics Faculty Director, "
               "Mercatus Center",
        "link": "https://www.mercatus.org/about"
    },
]

class MercatusCenterBlog(Blog):

    def __init__(self, name="Mercatus Center", about=description, about_link="https://www.mercatus.org/about",
                 authors=AUTHORS, image="mercatus_center", categories=["economics"]):

        super().__init__(name=name, about=about, about_link=about_link, authors=authors, recent_posts=None,
                         frequency=None, color=None, font=None, scraper=None, image=image, categories=categories)

