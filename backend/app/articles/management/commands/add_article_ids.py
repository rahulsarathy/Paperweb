from django.core.management.base import BaseCommand, CommandError
from reading_list.models import Article
from utils.s3_utils import get_article_id

class Command(BaseCommand):

	def handle(self, *args, **options):
		articles = Article.objects.all()
		for article in articles:
			article_id = get_article_id(article.permalink)
			article.custom_id = article_id
			article.save()
