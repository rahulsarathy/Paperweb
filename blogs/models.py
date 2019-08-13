from django.db import models
from django.conf import settings
from django.utils.translation import ugettext_lazy as _


# Create your models here.

class Blog(models.Model):
    name = models.CharField(_('Blog Name'), max_length=100)
    last_polled_time = models.DateTimeField(_('Last Polled Time'), max_length=8)
    home_url = models.CharField(_('Home URL'), max_length=100)
    rss_url = models.CharField(_('RSS URL'), max_length=100)

class Article(models.Model):
    title = models.CharField(_('Article Title'), max_length=100)
    permalink = models.CharField(_('Permalink'), max_length=500, primary_key=True)
    date_published = models.CharField(_('Date Published'), max_length=100)
    author = models.CharField(_('Author'), max_length=100)
    file_link = models.URLField(_('S3 File Link'), )
    blog = models.ForeignKey(Blog, on_delete=models.CASCADE)

class Comment(models.Model):
    author = models.CharField(_('Author'), max_length=100)
    content = models.CharField(_('Content'), max_length=100)
    date_published = models.CharField(_('Date Published'), max_length=8)
    parent_comment_id = models.IntegerField(_('Parent Comment ID'), default=None)
    article = models.ForeignKey(Article, on_delete=models.CASCADE)

class Subscription(models.Model):

    subscriber = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    date_subscribed = models.DateTimeField(_('Date Subscribed'))
    blog = models.OneToOneField(Blog, on_delete=models.CASCADE)


