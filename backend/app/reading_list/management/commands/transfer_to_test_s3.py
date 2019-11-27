from django.core.management.base import BaseCommand, CommandError
from blogs.models import Article
from utils.blog_utils import blog_from_url
import os
from utils.s3_utils import transfer_file, create_article_url

class Command(BaseCommand):

    def handle(self, *args, **options):
        all_articles = Article.objects.all()
        for article in all_articles:
            permalink = article.permalink
            blog = article.blog
            date_published = article.date_published
            title = article.title
            author = article.author

            transfer_content(article.file_link)

            article_id = hash(permalink)
            new_article_url = create_article_url(blog.name, article_id)
            new_article = Article(title=title, permalink=permalink, date_published=date_published, author=author,
                                  file_link=new_article_url, blog=blog)
            new_article.save()
            article.delete()

def transfer_content(s3_url):
    split_url = s3_url.split('amazonaws.com/')
    file_path = split_url[1].split('/')
    s3_file_path = os.path.join(file_path[1], file_path[2])
    transfer_file('pulpscrapedarticles', s3_file_path, 'pulpscrapedarticlestest')