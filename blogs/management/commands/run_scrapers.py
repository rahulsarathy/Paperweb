from django.core.management.base import BaseCommand, CommandError
from blogs.Ribbonfarm.ribbonfarm import RibbonfarmScraper
from blogs.melting_asphalt.melting_asphalt import MeltingAsphaltScraper

SCRAPERS = (
    RibbonfarmScraper,
    # MeltingAsphaltScraper
)

class Command(BaseCommand):

    def handle(self, *args, **options):
        for scraper in SCRAPERS:
            current_scraper = scraper()
            # current_scraper.poll()
            current_scraper.parse_permalink("https://www.ribbonfarm.com/2019/08/05/domestic-cozy-7/")