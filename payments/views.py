from django.shortcuts import render
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from utils.google_maps_utils import autocomplete
from utils import stripe_utils
from utils.stripe_utils import stripe
from django.http import JsonResponse, HttpResponse
from payments.models import BillingInfo
import json
from datetime import datetime
from django.utils.timezone import make_aware

from users.models import CustomUser

# Create your views here.
@api_view(['GET'])
def address_autocomplete(request):
    address = request.GET['address']
    autocompleted = autocomplete(address)

    return JsonResponse(autocompleted, safe=False)

@api_view(['GET'])
def create_session(request):
    current_user = request.user
    try:
        billing_info = BillingInfo.objects.get(customer=current_user)
        stripe_customer_id = None
        if billing_info and billing_info.stripe_customer_id:
            stripe_customer_id = billing_info.stripe_customer_id
        new_session = stripe_utils.create_session(current_user.id, current_user.email, stripe_customer_id)
    except:
        new_session = stripe_utils.create_session(current_user.id, current_user.email)

    return JsonResponse(new_session)

@api_view(['GET'])
def payment_status(request):
    current_user = request.user
    stripe_customer_id = None
    try:
        current_billing_info = BillingInfo.objects.get(customer=current_user)
        stripe_customer_id = current_billing_info.stripe_customer_id
    except:
        # User has not paid yet
        return HttpResponse(status=200)

    if stripe_customer_id is None:
        # User has not paid yet
        return HttpResponse(status=200)

    stripe_customer = stripe_utils.retrieve_customer(stripe_customer_id)
    subscriptions = stripe_customer.get('subscriptions')
    subscriptions_data = subscriptions.get('data')
    if len(subscriptions_data) > 1:
        return HttpResponse(status=208)
    else:
        return HttpResponse(status=208)

@api_view(['GET'])
def cancel_payment(request):
    current_user = request.user
    try:
        billing_info = BillingInfo.objects.get(customer=current_user)
    except:
        return HttpResponse("User has no billing info", status=403)

    stripe_customer_id = billing_info.stripe_customer_id
    stripe_customer = stripe_utils.retrieve_customer(stripe_customer_id)
    subscriptions = stripe_customer.get('subscriptions')
    subscriptions_data = subscriptions.get('data')
    for data_point in subscriptions_data:
        sub_id = data_point.id
        stripe_utils.delete_customer(sub_id)

    return HttpResponse(status=200)

@csrf_exempt
@api_view(['POST'])
def stripe_hook(request):
    print("stripe webhook hit!")
    payload = request.body
    event = None

    try:
        event = stripe.Event.construct_from(
            json.loads(payload), stripe.api_key
        )
    except ValueError as e:
        # Invalid payload
        return HttpResponse(status=400)

    if event.type == 'checkout.session.completed':
        handle_checkout_complete(event)
        return HttpResponse(status=200)
    else:
        # Unexpected event type
        return HttpResponse(status=400)

    return HttpResponse(status=200)

def handle_checkout_complete(event):
    stripe_response = event.data.object

    client_reference_id = stripe_response.get('client_reference_id')
    stripe_customer_id = stripe_response.get('customer')

    try:
        customer_billing_info = BillingInfo.objects.get(customer=client_reference_id)
    except:
        customer_billing_info = BillingInfo(customer=client_reference_id)

    customer_billing_info.stripe_customer_id = stripe_customer_id
    customer_billing_info.save()
