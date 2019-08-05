from blogs.substack.substack import SubstackScraper

if __name__ == "__main__":
    scraper = SubstackScraper(username="antonio", author="Antonio Garcia")
    scraper.poll()
    # scraper.get_all_posts(0)

