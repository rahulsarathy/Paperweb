from django.core.management.base import BaseCommand, CommandError
from blogs.Ribbonfarm import ribbonfarm_tests

class Command(BaseCommand)

    def add_arguments(self, parser):

        parser.add_argument('scraper', nargs='+', type=String)
