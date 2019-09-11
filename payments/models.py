from django.db import models
from django.utils.translation import gettext as _
from django.conf import settings

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

class Transaction(models.Model):
    transaction_date = models.DateTimeField(_('Transaction Date'))
    payment_tier = models.OneToOneField(PaymentTier, on_delete=models.CASCADE)
    payment_cancellation = models.BooleanField(_('Payment Cancellation'))

class BillingInfo(models.Model):
    delivery_address = models.CharField(_('Delivery Address'), max_length=100, default=None, null=True)
    stripe_customer_id = models.CharField(_('Stripe Customer ID'), max_length=100, default=None, null=True)
    payment_tier = models.OneToOneField(PaymentTier, on_delete=models.CASCADE, default=None, null=True)
    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self):
        return self.delivery_address