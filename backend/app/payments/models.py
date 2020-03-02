from django.db import models
from django.utils.translation import gettext as _
from django.conf import settings
from django.contrib.auth.models import User

# Create your models here.


class PaymentTier(models.Model):
    TIER0 = 'T0'
    TIER1 = 'T1'
    TIER2 = 'T2'
    TIER3 = 'T3'
    TIER_IN_PAYMENT_OPTION_CHOICES = (
        (TIER0, 'TIER0'),
        (TIER1, 'TIER1'),
        (TIER2, 'TIER2'),
        (TIER3, 'TIER3'),
    )
    tier_in_payment_option = models.CharField(
        max_length=2,
        choices=TIER_IN_PAYMENT_OPTION_CHOICES,
        default=TIER0
    )


class Address(models.Model):
    line_1 = models.CharField(max_length=500)
    line_2 = models.CharField(max_length=500, null=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100, null=True)
    zip = models.CharField(max_length=100, null=True)
    country = models.CharField(max_length=100)
    set = models.BooleanField(_('Address set'), default=False)

    def to_json(self):
        return {
            'line_1': self.line_1,
            'line_2': self.line_2,
            'city': self.city,
            'state': self.state,
            'zip': self.zip,
            'country': self.country,
        }


class BillingInfo(models.Model):
    delivery_address = models.OneToOneField(Address, on_delete=models.CASCADE, default=None, null=True)
    stripe_customer_id = models.CharField(_('Stripe Customer ID'), max_length=100, default=None, null=True)
    payment_tier = models.OneToOneField(PaymentTier, on_delete=models.CASCADE, default=None, null=True)
    customer = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.delivery_address