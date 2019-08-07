from apps.blogs import Scraper, Article
from urllib.request import urlopen, Request as req
import vcr
from bs4 import BeautifulSoup
from datetime import datetime

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) '
                         'Chrome/41.0.2228.0 Safari/537.3'}

class SubstackScraper(Scraper):
    def __init__(self,
                 name="Substack",
                 home_url="https://{}.substack.com",
                 username=None,
                 author=None
                 ):

        super().__init__(name=name, home_url=home_url, username=username, author=author)

        if not self.username:
            raise TypeError(
                "Substack scraper requires a valid username"
            )

        self.home_url = home_url.format(self.username)


    def _poll(self):
        toSend = req(url=self.home_url, headers=headers)

        with vcr.use_cassette('dump/substack/xml/first_article_{}.yaml'.format(self.home_url)):
            html = urlopen(toSend).read()

        soup = BeautifulSoup(html, 'html.parser')

        permalink = soup.find('a', attrs={"class"})

        article = soup.find('article', attrs={"class": "post"})

        title = soup.find('h1', attrs={"class": "post-title"}).text

        unparsed_date = soup.find('td', attrs={"class": "post-meta-item"}).text

        # take out top sharesheet
        article.find('table', attrs={"class": "post-meta big"}).decompose()

        # take out bottom sharesheet
        article.find('td', attrs={"class": "post-meta-item"}).parent.decompose()

        # if len has date,
        if len(unparsed_date) > 6:
                parsed_date = datetime.strptime(unparsed_date, '%b %d, %Y')

        else:
            parsed_date = datetime.strptime(unparsed_date, '%b %d')

        if parsed_date.year == 1900:
            parsed_date = datetime(datetime.today().year, parsed_date.month, parsed_date.day)

        f = open("dump/substack/substack_single_article.html", "w+")
        f.write(str(article))
        f.close()

        return Article(title=title, date_published=parsed_date, author=self.author, permalink=permalink)


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


