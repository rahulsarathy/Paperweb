from fpdf import FPDF, HTMLMixin
from django.core.management.base import BaseCommand
from blogs.models import Article, Blog, BlogBlock
from magazine.html_template import template
from users.models import CustomUser as User
from blogs.all_blogs import BLOGS
import datetime
import os
from pyPDF2 import PdfMileMerger
from utils.s3_utils import download_link
from bs4 import BeautifulSoup

class Command(BaseCommand):

    def handle(self, *args, **options):
        pass

    def add_arguments(self, parser):
        parser.add_argument('date_start', nargs='+', type=str)

    def create_magazines(self):
        for blog in BLOGS:
            create_block(blog)
        # for each blog create a magazine block of articles from start date to end date
        # for each user add that block in to their magazine

def create_block(blog):
    blog_orm = Blog.objects.get(name=blog.name)

    current_time = datetime.now()
    start_date = current_time.replace(day=1)
    end_date = current_time.replace(month=current_time.month + 1)
    start_date_string = start_date.strftime('%Y-%m-%d')
    end_date_string = end_date.strftime('%Y-%m-%d')

    articles = Article.objects.filter(blog=blog_orm).filter(date__range=[start_date_string, end_date_string])

    for article in articles:
        author = article.author
        title = article.title

        s3_url = article.file_link
        s3_file_path = s3_url.split('pulpscrapedarticles')[1]
        output_file_path = 'dump/downloads/{}'.format(s3_file_path)

        #stores in /download folder
        download_link(s3_file_path, output_file_path)
        blog_soup = BeautifulSoup(open(output_file_path))

        #grab template for blog
        soup = BeautifulSoup(open("magazine/blog_templates/{}".format(blog.name), "html.parser"))

        #inject html into template
        title_tag = soup.find('div', attrs={"class": "blog-title"})
        author_tag = soup.find('div', attrs={"class": "author"})
        article_tag = soup.find('div', attrs={"class": "blog-post"})
        title_tag.string = title
        author_tag.string = author
        article_tag.string = blog_soup



        #run princexml on downloaded path (/pdf)

        cmd = 'prince {pathname} -o {outputpath}'.format(pathname=)
        os.system(cmd)

    # join all the pdfs
    # store final pdf in s3