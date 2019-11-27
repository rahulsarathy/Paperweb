from bs4 import BeautifulSoup

def _remove_all_attrs(soup):
    for tag in soup.find_all(True):
        tag.attrs = {}
    return soup