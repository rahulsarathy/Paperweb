from django.contrib.auth import get_user_model
from rest_framework import viewsets
from users.serializers import UserSerializer
from payments.models import BillingInfo

from rest_framework.decorators import api_view
from django.http import JsonResponse, HttpResponse

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):

    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer

@api_view(['GET'])
def get_address(request):
    user = request.user

    try:
        billing_info = BillingInfo.objects.get(customer=user)
        address = billing_info.delivery_address
    except:
        address = ""

    return JsonResponse(address, safe=False)

@api_view(['POST'])
def set_address(request):
    current_user = request.user
    address = request.POST['address']

    try:
        billing_info = BillingInfo.objects.get(customer=current_user)
        billing_info.delivery_address = address
        billing_info.save()
    except:
        billing_info = BillingInfo(delivery_address=address, customer=current_user)
        billing_info.save()

    return HttpResponse(status=200)


