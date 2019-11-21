# users/forms.py
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import CustomUser
from allauth.account.signals import email_confirmed
from django.dispatch import receiver
from allauth.account.models import EmailConfirmation
from allauth.account.signals import user_signed_up
from allauth.account.utils import send_email_confirmation
from django.contrib.auth import get_user_model
User = get_user_model()

class CustomUserCreationForm(UserCreationForm):

    class Meta(UserCreationForm):
        model = CustomUser
        fields = ('username', 'email',)

class CustomUserChangeForm(UserChangeForm):

    class Meta:
        model = CustomUser
        fields = ('username', 'email',)

@receiver(email_confirmed)
def email_confirmed_(request, email_address, **kwargs):
    print("email confirmed")
    user = User.objects.get(email=email_address.email)
    user.email_activated = True
    user.save()

    email_confirmation = EmailConfirmation()

# @receiver(user_signed_up, dispatch_uid="some.unique.string.id.for.allauth.user_signed_up")
# def user_signed_up_(request, user, **kwargs):
#     print("received user sign up")
#     send_email_confirmation(request, user, True)