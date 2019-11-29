# users/forms.py
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import CustomUser
from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist
User = get_user_model()
from django import forms
from captcha.fields import ReCaptchaField
from payments.models import InviteCode
from allauth.compat import ugettext, ugettext_lazy as _

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
    invite_code = forms.CharField(max_length=12, label='Invite Code')

    def clean(self):
        invite_code = self.cleaned_data.get('invite_code')
        print("activation code is ", invite_code)
        try:
            check_invite = InviteCode.objects.get(key=invite_code)
            if check_invite.redeemed:
                self.add_error('invite_code', _("Invite code already redeemed."))
        except ObjectDoesNotExist:
            self.add_error('invite_code', _("Invalid Invite Code."))

        return self.cleaned_data

    def signup(self, request, user):
        print("entered saved")
        invite_code = self.cleaned_data.get('invite_code')
        try:
            check_invite = InviteCode.objects.get(key=invite_code)
            check_invite.redeemed = True
            check_invite.owner = user
            check_invite.redeemer = user
            check_invite.save()
        except ObjectDoesNotExist:
            raise ObjectDoesNotExist
        user.save()