from django.db import models
from django.conf import settings
from django.utils.translation import ugettext_lazy as _
from django.utils import timezone

from datetime import datetime

# Create your models here.

class Magazine(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    date_start = models.DateTimeField()
    date_end = models.DateTimeField()
    file_link = models.URLField(_('S3 File Link'), primary_key=True)

class Blog(models.Model):
    name = models.CharField(_('Blog Name'), max_length=255, unique=True)
    last_polled_time = models.DateTimeField(_('Last Polled Time'), max_length=8, null=True)
    home_url = models.URLField(_('Home URL'))
    rss_url = models.URLField(_('RSS URL'))
    scraped_old_posts = models.BooleanField(_('Scraped Old Posts'), default=False)

class BlogBlock(models.Model):
    blog = models.ForeignKey(Blog, on_delete=models.CASCADE)
    file_link = models.URLField(_('S3 File Link'), primary_key=True)
    date_start = models.DateTimeField()
    date_end = models.DateTimeField()

class Article(models.Model):
    title = models.CharField(_('Article Title'), max_length=255)
    permalink = models.URLField(_('Permalink'), primary_key=True)
    date_published = models.DateTimeField(_('Date Published'))
    author = models.CharField(_('Author'), max_length=255)
    file_link = models.URLField(_('S3 File Link'), )
    blog = models.ForeignKey(Blog, on_delete=models.CASCADE)
    magazine = models.ManyToManyField(Magazine)
    pdf_link = models.URLField(_('S3 PDF Link'), default=None, null=True)

    class Meta:
        ordering = ['-date_published']

class Comment(models.Model):
    author = models.CharField(_('Author'), max_length=100)
    content = models.CharField(_('Content'), max_length=100)
    date_published = models.CharField(_('Date Published'), max_length=8)
    parent_comment_id = models.IntegerField(_('Parent Comment ID'), default=None)
    article = models.ForeignKey(Article, on_delete=models.CASCADE)

class Subscription(models.Model):
    subscriber = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    date_subscribed = models.DateTimeField(_('Date Subscribed'), default=timezone.now)
    blog = models.OneToOneField(Blog, on_delete=models.CASCADE)

class ReadingListItem(models.Model):
    reader = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    date_added = models.DateTimeField(_('Date Added'), default=timezone.now)
    title = models.CharField(_('Article Title'), max_length=255)
    link = models.URLField(_('Link'), default="")
    date_added = models.DateTimeField(_('Date Added'))
    archived = models.BooleanField(_('Archived'), default=False, null=True)
    trashed = models.BooleanField(_('Trashed'), default=False, null=True)
    delivered = models.BooleanField(_('Delivered'), default=False, null=True)

    class Meta:
        unique_together = (("reader", "link"),)