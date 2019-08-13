from django.core.management.base import BaseCommand, CommandError
from blogs.Ribbonfarm import ribbonfarm_tests

class Command(BaseCommand):

    def add_arguments(self, parser):
        # Positional arguments
        parser.add_argument('individual_scraper', nargs='+', type=str)

        # Named (optional) arguments
        parser.add_argument(
            '--delete',
            action='store_true',
            help='Delete poll instead of closing it',
        )

    def handle(self, *args, **options):
        for scraper in options['individual_scraper']:
            print(scraper)
            a = scraper()
            a.poll()