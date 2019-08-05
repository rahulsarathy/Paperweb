from blogs.medium.medium import MediumScraper

if __name__ == "__main__":
    scraper = MediumScraper(username="nntaleb")
    scraper.poll()
    # scraper.get_all_posts(0)

