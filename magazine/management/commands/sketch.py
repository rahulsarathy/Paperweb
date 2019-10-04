from django.core.management.base import BaseCommand, CommandError
from utils.blog_utils import scraper_map
from bs4 import BeautifulSoup

class Command(BaseCommand):

    def handle(self, *args, **options):
        f = open("index.html", "r")
        soup = BeautifulSoup(f, 'html.parser')
        print(str(soup))

        c = open("output.html", "w+")
        output_soup = BeautifulSoup(c, "html.parser")
        # c.write(str(soup))