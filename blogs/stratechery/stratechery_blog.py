from blogs.BlogInformation import Blog

description = "Stratechery provides analysis of the strategy and business side of technology and media, and the " \
              "impact of technology on society. Weekly Articles are free, while three Daily Updates a week are for " \
              "subscribers only. Recommended by The New York Times as “one of the most interesting sources of " \
              "analysis on any subject”, Stratechery has subscribers from over 85 different countries, including" \
              " executives in both technology and industries impacted by technology, venture capitalists and " \
              "investors, and thousands of other people interested in understanding how and why the Internet is " \
              "changing everything."

AUTHORS = [
    {
        "name": "Ben Thompson",
        "bio": "Stratechery is written by me, Ben Thompson. I am based in Taipei, Taiwan, and am fully supported by "
               "my work at Stratechery. I’ve worked previously at Apple, Microsoft, and Automattic, where I focused "
               "on strategy, developer relations, and marketing for Apple University, Windows, and WordPress.com. "
               "I attended undergrad at the University of Wisconsin, received an MBA from Kellogg School of Management"
               " with a focus on strategy and marketing, and an MEM from McCormick Engineering school in Design and "
               "Innovation with a focus on human-centered design. I have been writing Stratechery since 2013, and it "
               "has been my full-time job since 2014.",
        "link": "https://en.wikipedia.org/wiki/Ben_Thompson_(writer)"
    }
]

class StratecheryBlog(Blog):

    def __init__(self, display_name="Stratechery", name_id="stratechery", about=description,
                 about_link="https://stratechery.com/about/", authors=AUTHORS, image="stratechery",
                 categories=["technology"]):

        super().__init__(display_name=display_name, name_id=name_id, about=about, about_link=about_link,
                         authors=authors, recent_posts=None, frequency=None, color=None, font=None, scraper=None,
                         image=image, categories=categories)

