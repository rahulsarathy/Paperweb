from fpdf import FPDF, HTMLMixin
from django.core.management.base import BaseCommand
from blogs.models import Article, Blog
from magazine.html_template import template
from users.models import CustomUser as User

class Command(BaseCommand):

    def handle(self, *args, **options):
        pass

    def create_magazines(self):

        # for each blog create a magazine block of articles from start date to end date
        # for each user add that block in to their magazine

