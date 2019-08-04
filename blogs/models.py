from django.db import models
from django.conf import settings
from django.utils.translation import gettext as _


# Create your models here.

class Comment(models.Model):
    author = models.CharField(_('Author'), max_length=100)
    content = models.CharField(_('Content'), max_length=100)
    date_published = models.CharField(_('Date Published'), max_length=8)
    parent_comment_id = models.IntegerField(_('Parent Comment ID'), default=None)

class Article(models.Model):
    title = models.CharField(_('Article Title'), max_length=100)
    date_published = models.CharField(_('Date Published'), max_length=100)
    author = models.CharField(_('Author'), max_length=100)
    comments = models.ForeignKey(Comment, on_delete=models.CASCADE)


class Blog(models.Model):

    name = models.CharField(_('Blog Name'), max_length=100)
    last_polled_time = models.DateTimeField(_('Last Polled Time'), max_length=8)
    home_url = models.CharField(_('Home URL'), max_length=100)
    rss_url = models.CharField(_('RSS URL'), max_length=100)
    Articles = models.ForeignKey(Article, on_delete=models.CASCADE)


class Subscription(models.Model):

    subscriber = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    date_subscribed = models.DateTimeField(_('Date Subscribed'))
    blog = models.OneToOneField(Blog, on_delete=models.CASCADE)


