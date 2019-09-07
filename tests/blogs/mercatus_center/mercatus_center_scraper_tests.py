from blogs.mercatus_center.mercatus_center_scraper import MercatusCenterScraper

from django.test import TestCase

import logging
import unittest
from unittest.mock import patch


class ScraperTests(TestCase):
    scraper = MercatusCenterScraper()

    @unittest.skip("skipping because unimplemented")
    def test_poll(self):
        pass

    def test_parse_bridge(self):
        permalink = 'https://www.mercatus.org/bridge/commentary/pressuring-fed-no-surefire-electoral-solution-says-' \
                    'economic-historian'
        self.scraper.parse_permalink(permalink)

        assert False

    @unittest.skip("skipping for speed")
    @patch('logging.Logger.warning')
    def test_parse_podcast(self, logger):
        permalink = 'https://www.mercatus.org/bridge/podcasts/09022019/judge-glock-riefler-keynes-doctrine-and-' \
                    'monetary-policy-during-great'

        self.scraper.parse_permalink(permalink)
        logger.assert_called_with("Skipping %s Scraper latest article because it is of type podcasts",
                                  self.scraper.name_id)