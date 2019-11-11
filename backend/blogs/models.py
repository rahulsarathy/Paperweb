from django.db import models
from django.conf import settings
from django.utils.translation import ugettext_lazy as _
from django.utils import timezone

from datetime import datetime

# Create your models here.

class Blog(models.Model):
    name = models.CharField(_('Blog Name'), max_length=255, unique=True)
    last_polled_time = models.DateTimeField(_('Last Polled Time'), max_length=8, null=True)
    home_url = models.URLField(_('Home URL'))
    rss_url = models.URLField(_('RSS URL'))
    scraped_old_posts = models.BooleanField(_('Scraped Old Posts'), default=False)

class Article(models.Model):
    title = models.CharField(_('Article Title'), max_length=255)
    permalink = models.URLField(_('Permalink'), primary_key=True, max_length=500)
    num_pages = models.IntegerField(_('Number of Pages'), default=1, null=True)
    html_link = models.URLField(_('S3 HTML Link'), default=None, null=True)

class Subscription(models.Model):
    subscriber = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    date_subscribed = models.DateTimeField(_('Date Subscribed'), default=timezone.now)
    blog = models.OneToOneField(Blog, on_delete=models.CASCADE)

class ReadingListItem(models.Model):
    reader = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    article = models.ForeignKey(Article, on_delete=models.CASCADE, default=None, null=True)
    date_added = models.DateTimeField(_('Date Added'), default=timezone.now)
    archived = models.NullBooleanField(_('Archived'))
    trashed = models.NullBooleanField(_('Trashed'))
    delivered = models.NullBooleanField(_('Delivered'))

    class Meta:
        unique_together = (("reader", "article"),)