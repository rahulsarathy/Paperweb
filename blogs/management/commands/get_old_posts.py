from django.core.management.base import BaseCommand, CommandError
from utils.blog_utils import blog_map, BLOGS

class Command(BaseCommand):

    def handle(self):
        for blog in BLOGS:
            current_blog = blog()
            current_blog.get_old_urls()