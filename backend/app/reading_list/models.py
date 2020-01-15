from django.db import models
from django.conf import settings
from django.utils.translation import ugettext_lazy as _
from django.utils import timezone
from jsonfield import JSONField

from datetime import datetime

# Create your models here.

class Article(models.Model):
    title = models.CharField(_('Article Title'), max_length=255)
    permalink = models.URLField(_('Permalink'), primary_key=True, max_length=500)
    word_count = models.IntegerField(_('Number of Words'), default=1, null=True)
    mercury_response = JSONField()

class ReadingListItem(models.Model):
    reader = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    article = models.ForeignKey(Article, on_delete=models.CASCADE, default=None, null=True)
    date_added = models.DateTimeField(_('Date Added'), default=timezone.now)
    archived = models.NullBooleanField(_('Archived'), default=False)
    trashed = models.NullBooleanField(_('Trashed'))
    delivered = models.NullBooleanField(_('Delivered'))
    to_deliver = models.BooleanField(_('Delivered'), default=False)

    class Meta:
        unique_together = (("reader", "article"),)