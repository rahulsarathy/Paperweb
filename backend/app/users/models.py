from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import ugettext_lazy as _


class CustomUser(AbstractUser):

    def __str__(self):
        return self.email

class Settings(models.Model):

    archive_links = models.BooleanField(_('Archive links once delivered'), default=True)
    deliver_oldest = models.BooleanField(_('Deliver oldest/newest articles first'), default=True)