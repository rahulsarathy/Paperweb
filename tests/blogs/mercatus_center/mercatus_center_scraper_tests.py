from blogs.mercatus_center.mercatus_center_scraper import MercatusCenterScraper
from utils.s3_utils import check_file, clear_all

from django.test import TestCase

import logging
import unittest
from unittest.mock import patch
import os
import vcr

BUCKET_NAME = 'pulpscrapedarticlestest'

class ScraperTests(TestCase):
    clear_all(BUCKET_NAME)
    scraper = MercatusCenterScraper()


    def test_poll(self):
        self.scraper._poll()

    @unittest.skip("skipping because unimplemented")
    @patch('blogs.parsability.handle_s3')
    def test_parse_bridge(self, handle_s3):
        permalink = 'https://www.mercatus.org/bridge/commentary/pressuring-fed-no-surefire-electoral-solution-says-' \
                    'economic-historian'

        with vcr.use_cassette('dump/test_parse_bridge.yaml'):
            self.scraper.parse_permalink(permalink)

        # TO DO
        handle_s3.assert_called_with()

    @patch('logging.Logger.warning')
    def test_parse_podcast(self, logger):
        permalink = 'https://www.mercatus.org/bridge/podcasts/09022019/judge-glock-riefler-keynes-doctrine-and-' \
                    'monetary-policy-during-great'

        self.scraper.parse_permalink(permalink)
        logger.assert_called_with("Skipping %s Scraper latest article because it is of type podcasts",
                                  self.scraper.name_id)