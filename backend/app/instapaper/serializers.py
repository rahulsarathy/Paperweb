from users.serializers import UserSerializer
from rest_framework import serializers
from .models import InstapaperCredentials


class InstapaperCredentialsSerializer(serializers.ModelSerializer):
    owner = UserSerializer()

    class Meta:
        model = InstapaperCredentials
        fields = ['owner', 'last_polled']
