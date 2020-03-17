from django.contrib.auth.models import User

from django.db import models
from encrypted_model_fields.fields import EncryptedCharField

# Create your models here.

class PocketCredentials(models.Model):
    owner = models.OneToOneField(User, on_delete=models.CASCADE)
    token = EncryptedCharField(max_length=35)
    last_polled = models.DateTimeField(default=None, null=True)
