from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.conf import settings


class CustomUser(AbstractUser):

    def __str__(self):
        return self.email


class Settings(models.Model):

    archive_links = models.BooleanField(_('Archive links once delivered'), default=True)
    deliver_oldest = models.BooleanField(_('Deliver oldest/newest articles first'), default=True)
    setter = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, related_name='setter')
