from django.core.management.base import BaseCommand, CommandError
from utils.blog_utils import BLOGS

class Command(BaseCommand):

    def handle(self, *args, **options):
        for blog in BLOGS:
            current_blog = blog()
            current_blog.poll()