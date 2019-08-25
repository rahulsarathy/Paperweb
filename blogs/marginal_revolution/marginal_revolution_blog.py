from blogs.BlogInformation import Blog

description = "The Mercatus Center at George Mason University is the world’s premier university source for " \
              "market-oriented ideas—bridging the gap between academic ideas and real-world problems."

AUTHORS = [
    {
        "name": "Tyler Cowen",
        "bio": "Tyler Cowen is Holbert L. Harris Professor of Economics at George Mason University and also Director"
               " of the Mercatus Center. He received his Ph.d. in economics from Harvard University in 1987. His book"
               " The Great Stagnation: How America Ate the Low-Hanging Fruit of Modern History, Got Sick, and Will "
               "(Eventually) Feel Better was a New York Times best-seller. He was recently named in an Economist poll "
               "as one of the most influential economists of the last decade and several years ago Bloomberg "
               "BusinessWeek dubbed him \"America's Hottest Economist.\" Foreign Policy magazine named him as one of "
               "its \"Top 100 Global Thinkers\" of 2011. His next book, about American business, is due out in 2019. "
               "He has blogged at Marginal Revolution every day for almost fifteen years.",
        "link": "https://marginalrevolution.com/marginalrevolution/author/tyler-cowen"
    },
    {
        "name": "Alex Tabarokk",
        "bio": "Alex Tabarrok is Bartley J. Madden Chair in Economics at the Mercatus Center and a professor of "
               "economics at George Mason University. Along with Tyler Cowen, he is the co-author of the popular "
               "economics blog Marginal Revolution and co-founder of Marginal Revolution University. He is the author"
               " of numerous academic papers in the fields of law and economics, criminology, regulatory policy, "
               "voting theory and other areas in political economy. He is co-author with Tyler of Modern Principles of "
               "Economics, a widely used introductory textbook. He gave a TED talk in 2009. His articles have appeared"
               " in the New York Times, the Washington Post, the Wall Street Journal, and many other publications.",
        "link": "https://marginalrevolution.com/about"
    }
]

class MarginalRevolutionBlog(Blog):

    def __init__(self, display_name="Marginal Revolution", name_id="marginal_revolution", about=description, about_link="https://marginalrevolution.com/about",
                 authors=AUTHORS, image="marginal_revolution", categories=["economics"]):

        super().__init__(display_name=display_name, name_id=name_id, about=about, about_link=about_link, authors=authors, recent_posts=None,
                         frequency=None, color=None, font=None, scraper=None, image=image, categories=categories)

