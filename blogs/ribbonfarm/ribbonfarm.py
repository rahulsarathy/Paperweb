from blogs.parsability import Scraper, Article
from urllib.request import urlopen, Request as req
import vcr
from datetime import datetime
from time import mktime
from bs4 import BeautifulSoup
import feedparser


def is_last_page(soup):

    navigation = soup.find('div', attrs={"class": "navigation"})

    next_li = navigation.find('li', attrs={"class": "pagination-next"})

    if next_li is None:
        return True

    return False

class RibbonfarmScraper(Scraper):
    def __init__(self,
                name="ribbonfarm",
                rss_url="https://www.ribbonfarm.com/feed/",
                 home_url="https://www.ribbonfarm.com"):

        super().__init__(name=name, rss_url=rss_url, home_url=home_url)


    def _poll(self):
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) '
                                 'Chrome/41.0.2228.0 Safari/537.3'}

        with vcr.use_cassette('dump/ribbonfarm/xml/ribbonfarm_xml.yaml'):
            xml = feedparser.parse(self.rss_url)

        unparsed_article = xml.entries[0]

        title = unparsed_article.title

        permalink = unparsed_article.link

        author = unparsed_article.author

        unparsed_date = unparsed_article.published_parsed
        parsed_date = datetime.fromtimestamp(mktime(unparsed_date))

        toSend = req(url=permalink, headers=headers)

        with vcr.use_cassette('dump/ribbonfarm/xml/first_article_{}.yaml'.format(permalink)):
            html = urlopen(toSend).read()

        soup = BeautifulSoup(html, 'html.parser')

        article = soup.find('div', attrs={"class": "entry-content"})

        article.find('fieldset').decompose()
        article.find('div', attrs={"class": "sharedaddy"}).decompose()

        f = open("dump/ribbonfarm/ribbonfarm_single_article.html", "w+")
        f.write(str(article))
        f.close()

        return Article(title=title, date_published=parsed_date, author=author, permalink=permalink)


    def get_all_posts(self, page):
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) '
                                 'Chrome/41.0.2228.0 Safari/537.3'}

        if page == 0:
            url = self.home_url
        else:
            url = "https://ribbonfarm.com/page/{}/".format(page)

        toSend = req(url=url, headers=headers)

        with vcr.use_cassette('dump/ribbonfarm/html/ribbonfarm_source_page{}.yaml'.format(page)):
            html = urlopen(toSend).read()

        soup = BeautifulSoup(html, 'html.parser')

        if is_last_page(soup):
            return

        posts = soup.findAll('a', attrs={"class": "entry-title-link"})

        if page == 0:
            f = open("dump/ribbonfarm/ribbonfarm_links.txt", "w+")
        else:
            f = open("dump/ribbonfarm/ribbonfarm_links.txt", "a")

        for index, post in enumerate(posts):
            print(str(post.get('href', None)))
            f.write(str(post.get('href', None)) + '\n')

        f.close()

        self.get_all_posts(page + 1)


