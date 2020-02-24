# users/forms.py
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import CustomUser
from django.contrib.auth import get_user_model
User = get_user_model()
from django import forms
from captcha.fields import ReCaptchaField


class CustomUserCreationForm(UserCreationForm):

    class Meta(UserCreationForm):
        model = CustomUser
        fields = ('username', 'email',)


class CustomUserChangeForm(UserChangeForm):

    class Meta:
        model = CustomUser
        fields = ('username', 'email',)


class AllauthSignupForm(forms.Form):

    captcha = ReCaptchaField()

    def signup(self, request, user):
        pass
