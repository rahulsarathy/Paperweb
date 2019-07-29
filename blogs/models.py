from django.db import models
from django.conf import settings

# Create your models here.

class Subscription(models.Model):

    subscriber = models.ForeignKey(settings.AUTH_USER_MODEL)
    date_subscribed = models.DateTimeField(_('Date Subscribed'))
    blog = models.

class Blog(models.Model):

    name = models.CharField(_('Blog Name'))
    last_polled_time = models.DateTimeField(_('Last Polled Time'))
    home_url = models.CharField(_('Home URL'))
    rss_url = models.CharField(_('RSS URL'))
    Articles = models.ForeignKey

class Article(models.Model):
    title = models.CharField(_('Article Title'))
    date_published = models.CharField(_('Date Published'))
    author = models.CharField(_('Author'))
    comments = models.ForeignKey()

class Comment(models.Model):
    author = models.CharField(_('Author'))
    content = models.CharField(_('Content'))
    date_published = models.CharField(_('Date Published'))
    parent_comment_id = models.IntegerField(_('Parent Comment ID'))