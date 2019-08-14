
class Blog(object):

    def __init__(self, name, about, about_link, authors, recent_posts, frequency, color,
                 font, scraper, image, categories):

        self.name = name
        self.about = about
        self.about_link = about_link
        self.authors = authors
        self.recent_posts = recent_posts
        self.frequency = frequency
        self.color = color
        self.font = font
        self.scraper = scraper
        self.image = image
        self.categories = categories

    def to_json(self):

        return {
            'name': self.name,
            'about': self.about,
            'about_link': self.about_link,
            'authors': self.authors,
            'recent_posts': self.recent_posts,
            'image': self.image,
            'categories': self.categories,
            'color': self.color,
            'font': self.font,
        }