from blogs.BlogInformation import Blog

description = "Ribbonfarm is a longform blog devoted to unusual takes on both familiar and new themes. " \
              "What they call “refactored perception. Venkatesh Rao serves as Editor-in-Chief. Sarah Perry serves as " \
              "Contributing Editor. Kevin Simler, Joe Kelly, Carlos Bueno, Renee DiResta, and Taylor Pearson serve " \
              "as editors-at-large and comprise the Ribbonfarm Editorial Board."

AUTHOR_BIO = "Venkat started writing Ribbonfarm in 2007. His other writing includes Tempo, a book about " \
             "decision-making, and two ebooks, Be Slightly Evil and The Gervais Principle. He is also the creator " \
             "of the Breaking Smart binge-reading site and email newsletter. His writing can also be found at " \
             "Aeon magazine, The Atlantic, Information Week and Forbes. He lives in Seattle."

AUTHORS = [
    {
        "name": "Venkatesh Rao",
        "bio": "Venkat started writing Ribbonfarm in 2007. His other writing includes Tempo, a book about "
               "decision-making, and two ebooks, Be Slightly Evil and The Gervais Principle. He is also the creator "
               "of the Breaking Smart binge-reading site and email newsletter. His writing can also be found at Aeon "
               "magazine, The Atlantic, Information Week and Forbes. He lives in Seattle.",
        "link": "https://en.wikipedia.org/wiki/Venkatesh_Rao_(writer)"
    },
    {
        "name": "Sarah Perry",
        "bio": "Sarah began contributing to Ribbonfarm in 2015, and serves as Contributing Editor. She also blogs at "
               "The View from Hell. She is also the author of Every Cradle is a Grave, a book about the ethics of "
               "birth and suicide. She is based in Reno. ",
        "link": "https://twitter.com/sarahdoingthing?lang=en"
    }
]

class RibbonfarmBlog(Blog):

    def __init__(self, name="Ribbonfarm", about=description, about_link="https://www.ribbonfarm.com/about/",
                 authors=AUTHORS, image="ribbonfarm"):

        super().__init__(name=name, about=about, about_link=about_link, authors=authors, recent_posts=None,
                         frequency=None, color=None, font=None, scraper=None, image=image, categories=None)

