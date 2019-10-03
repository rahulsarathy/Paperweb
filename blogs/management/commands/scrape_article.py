from django.core.management.base import BaseCommand, CommandError
from blogs.Ribbonfarm.ribbonfarm_scraper import RibbonfarmScraper
from blogs.melting_asphalt.melting_asphalt_scraper import MeltingAsphaltScraper
from blogs.Econlib.bryan_caplan.bryan_caplan_scraper import BryanCaplanEconlibScraper
from blogs.serializers import ArticleSerializer
from utils.blog_utils import MercatusCenterScraper

class Command(BaseCommand):

    def add_arguments(self, parser):
        parser.add_argument('permalink', nargs='+', type=str)

    def handle(self, *args, **options):

        for permalink in options['permalink']:
            correct_scraper = find_scraper(permalink)
            article = correct_scraper.parse_permalink(permalink)
            serializer = ArticleSerializer(article)
            print(serializer.data)

        # for scraper in SCRAPERS:
        #     current_scraper = scraper()
        #     # current_scraper.poll()
        #     current_scraper.parse_permalink("https://www.ribbonfarm.com/2019/08/05/domestic-cozy-7/")
        #

def find_scraper(permalink):

    if 'econlib' in permalink:
        scraper = BryanCaplanEconlibScraper()
        return scraper
    if 'mercatus.org' in permalink:
        scraper = MercatusCenterScraper()
        return scraper
