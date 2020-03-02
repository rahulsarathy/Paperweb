from django.db import models
from django.conf import settings
from django.utils.translation import ugettext_lazy as _
from django.utils import timezone
from jsonfield import JSONField
from django.contrib.auth.models import User


from datetime import datetime

# Create your models here.


class SubstackRequest(models.Model):
    requester = models.ForeignKey(User, on_delete=models.CASCADE)
    substack_id = models.CharField(_('Substack Name'), max_length=255)
    fulfilled = models.BooleanField(_('Request Completed'), default=False)

    class Meta:
        unique_together = (("requester", "substack_id"),)