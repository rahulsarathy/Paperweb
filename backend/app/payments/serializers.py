from rest_framework import serializers
from payments.models import InviteCode


class InviteCodeSerializer(serializers.ModelSerializer):

    class Meta:
        model = InviteCode
        fields = ['key', 'redeemed', 'notes']
