import datetime

from django.db import models
from django.utils import timezone
from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.base_user import BaseUserManager

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
    delivery_address = models.CharField(_('Delivery Address'), max_length=100)
    stripe_customer_id = models.CharField(_('Stripe Customer ID'), max_length=100)
    payment_tier = models.OneToOneField(PaymentTier, on_delete=models.CASCADE)

    def __str__(self):
        return self.delivery_address

class User(AbstractBaseUser):
    email = models.EmailField(_('email address'), unique=True)
    first_name = models.CharField(_('first name'), max_length=30, blank=True)
    last_name = models.CharField(_('last name'), max_length=30, blank=True)
    date_joined = models.DateTimeField(_('date joined'), auto_now_add=True)
    kindle_email_address = models.EmailField(_('kindle email address'))
    billing_information = models.OneToOneField(BillingInfo, on_delete=models.CASCADE)

class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        """
        Creates and saves a User with the given email and password.
        """
        if not email:
            raise ValueError('The given email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(email, password, **extra_fields)