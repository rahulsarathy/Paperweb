from users.models import CustomUser, Settings
from rest_framework import serializers


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['email', 'first_name', 'last_name', 'date_joined', 'kindle_email_address', 'billing_information']


class SettingsSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Settings
        fields = ['archive_links', 'deliver_oldest']
