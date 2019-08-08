from django.contrib.auth import get_user_model
from rest_framework import viewsets
from api.serializers import UserSerializer

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):

    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
