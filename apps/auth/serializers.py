from apps.auth.models import User
from rest_framework import serializers

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'date_joined', 'kindle', 'billing_information']