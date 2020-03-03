from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.models import User


class Settings(models.Model):

    archive_links = models.BooleanField(_('Archive links once delivered'), default=True)
    deliver_oldest = models.BooleanField(_('Deliver oldest/newest articles first'), default=True)
    setter = models.ForeignKey(User, on_delete=models.CASCADE, null=True, related_name='setter')
