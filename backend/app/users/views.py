from payments.models import BillingInfo, Address
from rest_framework.decorators import api_view, parser_classes
from django.http import JsonResponse, HttpResponse
import json
from users.serializers import SettingsSerializer
from users.models import Settings
import logging


@api_view(['GET'])
def get_address(request):
    user = request.user

    try:
        billing_info = BillingInfo.objects.get(customer=user)
        address = billing_info.delivery_address
        to_send = address.to_json()
    except BillingInfo.DoesNotExist:
        to_send = ''

    return JsonResponse(to_send, safe=False)


@api_view(['GET'])
def get_settings(request):
    user = request.user
    try:
        my_settings = Settings.objects.get(setter=user)
    except Settings.DoesNotExist:
        my_settings = Settings(setter=user)
        my_settings.save()
    serializer = SettingsSerializer(my_settings)
    json_response = serializer.data
    return JsonResponse(json_response)


@api_view(['GET'])
def get_email(request):
    user = request.user
    email = user.email
    return JsonResponse(email, safe=False)

@api_view(['POST'])
def set_settings(request):
    user = request.user
    archive_links = request.POST.get('archive_links') == 'true'
    deliver_oldest = request.POST.get('sortby') == 'oldest'
    try:
        my_settings = Settings.objects.get(setter=user)
        my_settings.archive_links = archive_links
        my_settings.deliver_oldest = deliver_oldest
        my_settings.save()
    except Settings.DoesNotExist:
        logging.warning("")
        return HttpResponse(status=500)

    return HttpResponse(status=200)


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
    except BillingInfo.DoesNotExist:
        billing_info = BillingInfo(customer=current_user, delivery_address=new_address)
        billing_info.save()

    return JsonResponse(new_address.to_json())