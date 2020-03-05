from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth.models import User
from reading_list.tasks import handle_pages_task
from reading_list.models import Article


class Command(BaseCommand):

    def handle(self, *args, **options):
        articles = Article.objects.all()
        for article in articles:
            if article.page_count is None:
                handle_pages_task.delay(article.permalink)
