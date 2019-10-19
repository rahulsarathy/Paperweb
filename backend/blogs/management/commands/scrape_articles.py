from django.core.management.base import BaseCommand, CommandError
from utils.blog_utils import blog_map

class Command(BaseCommand):

    def add_arguments(self, parser):
        parser.add_argument('--blog_id', type=str)
        parser.add_argument('--num_posts', type=int)


    def handle(self, *args, **options):
        blog_id = options['blog_id']
        num_posts = options['num_posts']

        correct_scraper = blog_map(blog_id)
        correct_scraper().get_last_posts(num_posts)