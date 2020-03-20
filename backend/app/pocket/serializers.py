from users.serializers import UserSerializer
from rest_framework import serializers
from .models import PocketCredentials

class PocketCredentialsSerializer(serializers.ModelSerializer):
    owner = UserSerializer()

    class Meta:
        model = PocketCredentials
        fields = ['owner', 'last_polled', 'invalid']