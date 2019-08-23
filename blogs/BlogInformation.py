
class Blog(object):

    def __init__(self, display_name, name_id, about, about_link, authors, recent_posts, frequency, color,
                 font, scraper, image, categories):

        self.display_name = display_name
        self.name_id = name_id
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
            'name': self.display_name,
            'name_id': self.name_id,
            'about': self.about,
            'about_link': self.about_link,
            'authors': self.authors,
            'recent_posts': self.recent_posts,
            'image': self.image,
            'categories': self.categories,
            'color': self.color,
            'font': self.font,
        }