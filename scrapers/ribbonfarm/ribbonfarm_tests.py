from scrapers.ribbonfarm.ribbonfarm import RibbonfarmScraper

if __name__ == "__main__":
    scraper = RibbonfarmScraper()
    scraper.poll()
    # scraper.get_all_posts(0)

