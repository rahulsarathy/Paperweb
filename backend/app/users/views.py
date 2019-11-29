from payments.models import BillingInfo, Address, InviteCode
from rest_framework.decorators import api_view, parser_classes
from django.http import JsonResponse, HttpResponse
from payments.serializers import InviteCodeSerializer
import json


@api_view(['GET'])
def get_address(request):
    user = request.user

    try:
        billing_info = BillingInfo.objects.get(customer=user)
        address = billing_info.delivery_address
        to_send = address.to_json()
    except:
        to_send = ''

    return JsonResponse(to_send, safe=False)

@api_view(['GET'])
def get_invite_codes(request):
    user = request.user
    invite_codes = InviteCode.objects.filter(owner=user, redeemer=None)
    serializer = InviteCodeSerializer(invite_codes, many=True)
    json_response = serializer.data
    return JsonResponse(json_response, safe=False)

@api_view(['POST'])
def set_address(request):
    current_user = request.user
    address_json = json.loads(request.POST.get('address_json'))
    line_1 = address_json['line_1']
    line_2 = address_json['line_2']
    city = address_json['city']
    state = address_json['state']
    zip = address_json['zip']
    country = address_json['country']

    if line_1 is '':
        return HttpResponse(status=403)

    new_address = Address(line_1=line_1, line_2=line_2, city=city, state=state, zip=zip, country=country)
    new_address.save()

    try:
        billing_info = BillingInfo.objects.get(customer=current_user)

        # Delete Old Address
        if billing_info.delivery_address is not None:
            billing_info.delivery_address.delete()

        billing_info.delivery_address = new_address
        billing_info.save()
    except:
        billing_info = BillingInfo(customer=current_user, delivery_address=new_address)
        billing_info.save()

    return JsonResponse(new_address.to_json())