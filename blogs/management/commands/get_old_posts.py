from django.core.management.base import BaseCommand, CommandError
from utils.blog_utils import blog_map, BLOGS

class Command(BaseCommand):

    def add_arguments(self, parser):
        # Named (optional) arguments
        parser.add_argument(
            '--blog_id',
            type=str,
            help='Provide a Blog ID to get old URLs',
        )

    def handle(self, *args, **options):
        if options['blog_id']:
            blog_id = options['blog_id']
            blog = blog_map(blog_id)
            current_blog = blog()
            current_blog.get_old_urls()
        else:
            for blog in BLOGS:
                current_blog = blog()
                current_blog.get_old_urls()