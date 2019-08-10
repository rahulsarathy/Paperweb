from blogs.BlogInformation import Blog

description = "\"Kwokchain is an experiment to push myself to write more. My hope is that sharing these more " \
              "publicly will lead to more interesting discussions. If you’re reading this and I have less essays " \
              "than you have fingers on one hand–I’m failing at this goal. I’m particularly interested in " \
              "understanding the underlying structures that shape industries and the core loops that drive companies.\""

AUTHORS = [
    {
        "name": "Kevin Kwok",
        "bio": "\"I formerly worked at Greylock Partners investing in marketplaces, autonomous vehicles, "
               "bottoms up productivity tools, and more. I also have a twitter, where I talk more and "
               "people understand me less.\"",
        "link": "https://twitter.com/kevinakwok"
    },
]

class KwokChainBlog(Blog):

    def __init__(self, name="Kevin Kwok", about=description, about_link="https://kwokchain.com/about/",
                 authors=AUTHORS, image='kwokchain',):

        super().__init__(name=name, about=about, about_link=about_link, authors=authors, recent_posts=None,
                         frequency=None, color=None, font=None, scraper=None, image=image, categories=None)

