# -*- coding: utf-8 -*-

from blogs.BlogInformation import Blog

description = """
Kevin Simler started Melting Asphalt in 2012 as an exhaust pipe for my intellectual life and an excuse to practice 
the craft of writing. On both counts it's been a success. I still experience way too much psychic friction in 
getting posts out the door. But I've nevertheless managed to publish more than 300,000 words since starting 
this blog, which has had the intended effect: helping clear the way (prime the pump?) for even more ideas.
"""
AUTHORS = [
    {
        "name": "Kevin Simler",
        "bio": """
        Kevin Simler graduated from Berkeley in 2004 with degrees in Philosophy and Computer Science. I started a PhD in 
        Computational Linguistics at MIT, but left in 2006 to join Palantir Technologies — then (and always!) a 
        startup — where I worked for 7 years as an engineer, engineering manager, and product designer. 
        It was my professional coming-of-age and the experience of a lifetime. Hard to walk away from that, 
        but — what can I say? — I'm a restless millennial with other itches to scratch. I've since published a 
        book on social psychology (coauthored with Robin Hanson) and joined a very promising biotech startup.
        """,
        "link": "https://meltingasphalt.com/about/",
        "profile": "https://buster.wiki/images/people/kevin-simler.jpg",
    },
]


class MeltingAsphaltBlog(Blog):

    def __init__(self, name="Melting Asphalt", about=description, about_link="https://meltingasphalt.com/about/",
                 authors=AUTHORS, image="melting_asphalt", categories=["rationality"]):

        super().__init__(name=name, about=about, about_link=about_link, authors=authors, recent_posts=None,
                         frequency=None, color=None, font=None, scraper=None, image=image, categories=categories)

