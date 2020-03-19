
from django.contrib.auth.models import User

from django.db import models
from encrypted_model_fields.fields import EncryptedCharField
from django.contrib.postgres.fields import JSONField
from django.utils.translation import ugettext_lazy as _


# Create your models here.

class InstapaperCredentials(models.Model):
    oauth_token = EncryptedCharField(_('Password'), max_length=255, null=True)
    oauth_token_secret = EncryptedCharField(_('Password'), max_length=255, null=True)
    owner = models.OneToOneField(User, on_delete=models.CASCADE)
    last_polled = models.DateTimeField(default=None, null=True)
    polled_bookmarks = JSONField(null=True, default=dict)
    invalid = models.NullBooleanField(null=True, default=None)
