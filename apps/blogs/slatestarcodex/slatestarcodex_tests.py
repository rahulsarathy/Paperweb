from scrapers.slatestarcodex import SlateStarCodex

if __name__ == "__main__":
    scraper = SlateStarCodex()
    scraper.poll()
    # scraper.get_all_posts(0)

