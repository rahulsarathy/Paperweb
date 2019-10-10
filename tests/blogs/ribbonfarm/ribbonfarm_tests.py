from blogs.scrapers.ribbonfarm import RibbonfarmScraper


if __name__ == "__main__":
    scraper = RibbonfarmScraper()
    # scraper.poll()
    scraper.parse_permalink("https://www.ribbonfarm.com/2019/08/05/domestic-cozy-7/")
    # scraper.get_all_posts(0)

