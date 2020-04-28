from reading_list.models import Article
from pulp.globals import HTML_BUCKET
from utils.s3_utils import check_file, get_article_id
from reading_list.utils import html_to_s3

from django.core.management.base import BaseCommand, CommandError

class Command(BaseCommand):

	def add_arguments(self, parser):

		# Named (optional) arguments
		parser.add_argument(
			'--update_mercury',
			action='update_mercury',
			help='Update the mercury response in the DB',
		)

	def handle(self, *args, **options):

		articles = Article.objects.all()
		for article in articles:
			article_id = get_article_id(article.permalink)
			html_to_s3(article)

			if not check_file('{}.html'.format(article_id), HTML_BUCKET):