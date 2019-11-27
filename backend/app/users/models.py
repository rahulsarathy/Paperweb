from django.contrib.auth.models import AbstractUser
from payments.models import BillingInfo
from django.db import models
from django.utils.translation import ugettext_lazy as _


class CustomUser(AbstractUser):

    def __str__(self):
        return self.email