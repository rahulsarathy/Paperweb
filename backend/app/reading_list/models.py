from django.db import models
from django.conf import settings
from django.utils.translation import ugettext_lazy as _
from django.utils import timezone
from django.contrib.postgres.fields import JSONField
from encrypted_model_fields.fields import EncryptedCharField

from django.contrib.auth.models import User


class Article(models.Model):
    title = models.CharField(_('Article Title'), max_length=255)
    permalink = models.URLField(_('Permalink'), primary_key=True, max_length=500)
    page_count = models.IntegerField(_('Number of Words'), default=None, null=True)
    mercury_response = JSONField()
    preview_text = models.CharField(_('Preview Text'), null=True, max_length=350)


class ReadingListItem(models.Model):
    reader = models.ForeignKey(User, on_delete=models.CASCADE)
    article = models.ForeignKey(Article, on_delete=models.CASCADE, default=None, null=True)
    date_added = models.DateTimeField(_('Date Added'), default=timezone.now)
    archived = models.NullBooleanField(_('Archived'), default=False)
    trashed = models.NullBooleanField(_('Trashed'))
    delivered = models.NullBooleanField(_('Delivered'))
    to_deliver = models.BooleanField(_('Delivered'), default=False)

    class Meta:
        unique_together = (("reader", "article"),)


class InstapaperCredentials(models.Model):
    oauth_token = EncryptedCharField(_('Password'), max_length=255, null=True)
    oauth_token_secret = EncryptedCharField(_('Password'), max_length=255, null=True)
    owner = models.OneToOneField(User, on_delete=models.CASCADE)
    last_polled = models.DateTimeField(default=None, null=True)
    polled_bookmarks = JSONField(null=True, default=dict)

class PocketCredentials(models.Model):
    owner = models.OneToOneField(User, on_delete=models.CASCADE)
    token = EncryptedCharField(max_length=35)
    last_polled = models.DateTimeField(default=None, null=True)
