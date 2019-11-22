from django.contrib.auth.models import AbstractUser
from payments.models import BillingInfo
from django.db import models
from django.utils.translation import ugettext_lazy as _


class CustomUser(AbstractUser):
    email_activated = models.BooleanField(_('Activated Through Email'), default=False)

    def __str__(self):
        return self.email