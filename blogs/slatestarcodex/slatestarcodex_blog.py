from blogs.BlogInformation import Blog

description = "Welcome to Slate Star Codex, a blog about science, medicine, philosophy, politics, and futurism."

AUTHORS = [
    {
        "name": "Scott Alexander",
        "bio": "SSC is the project of Scott Alexander, a psychiatrist on the US West Coast. You can email him at "
               "scott[at]slatestarcodex[dot]com. Note that emailing bloggers who say they are psychiatrists is a bad "
               "way to deal with your psychiatric emergencies, and you might wish to consider talking to your doctor "
               "or going to a hospital instead.",
        "link": "https://slatestarcodex.com/about/"
    },
]

class SlateStarCodexBlog(Blog):

    def __init__(self, display_name="SlateStarCodex", name_id="slatestarcodex", about=description, about_link="https://slatestarcodex.com/about/",
                 authors=AUTHORS, image="slatestarcodex", categories=["rationality"]):

        super().__init__(display_name=display_name, name_id=name_id, about=about, about_link=about_link, authors=authors, recent_posts=None,
                         frequency=None, color=None, font=None, scraper=None, image=image, categories=categories)

