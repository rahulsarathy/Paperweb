import math

from django.shortcuts import render
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from utils.google_maps_utils import autocomplete
from utils import stripe_utils
from utils.stripe_utils import stripe
from django.http import JsonResponse, HttpResponse
from payments.models import BillingInfo
import json
from datetime import datetime, timedelta
from django.utils import timezone
from dateutil.relativedelta import relativedelta
from django.contrib.auth.models import User

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
        new_session = stripe_utils.create_session(current_user.id, stripe_customer_id=stripe_customer_id)
    except Exception as e:
        new_session = stripe_utils.create_session(current_user.id, current_user.email)

    return JsonResponse(new_session)

@api_view(['GET'])
def payment_status(request):
    current_user = request.user

    stripe_customer_id = None
    try:
        current_billing_info = BillingInfo.objects.get(customer=current_user)
        stripe_customer_id = current_billing_info.stripe_customer_id
    except BillingInfo.DoesNotExist:
        # User has not paid yet
        return HttpResponse(status=200)

    if stripe_customer_id is None:
        # User has not paid yet
        return HttpResponse(status=200)

    stripe_customer = stripe_utils.retrieve_customer(stripe_customer_id)
    subscriptions = stripe_customer.get('subscriptions')
    subscriptions_data = subscriptions.get('data')
    if len(subscriptions_data) >= 1:
        # User has paid
        return HttpResponse(status=208)
    else:
        # User has paid
        return HttpResponse(status=200)

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
    if len(subscriptions_data) == 0:
        return HttpResponse("User has no subscription", status=403)
    for data_point in subscriptions_data:
        sub_id = data_point.id
        stripe_utils.delete_subscription(sub_id)

    return HttpResponse(status=200)

@api_view(['GET'])
def next_billing_date(request):
    current_user = request.user
    try:
        user_billing_info = BillingInfo.objects.get(customer=current_user)
    except:
        return HttpResponse(status=400)
    stripe_customer_id = user_billing_info.stripe_customer_id
    stripe_customer = stripe_utils.retrieve_customer(stripe_customer_id)
    billing_anchor = stripe_customer.get('subscriptions').get('data')[0].get('billing_cycle_anchor')
    value = datetime.fromtimestamp(billing_anchor)

    next_billing_date = {
        'day': value.day,
        'month': value.strftime("%B"),
        'year': value.year,
    }

    return JsonResponse(next_billing_date)

def date_finder(current_date):
    wanted_day = 6 # sunday

    first_day_of_month = datetime(current_date.year, current_date.month, 1)
    first_day_of_month_weekday = first_day_of_month.weekday()

    delta = abs(wanted_day - first_day_of_month_weekday)

    first_occurence = first_day_of_month + timedelta(days=delta)

    second_occurence = first_occurence + timedelta(days=7)

    fourth_occurence = second_occurence + timedelta(days=14)

    first_day_of_next_month = datetime(current_date.year, current_date.month + 1, 1)
    first_day_of_next_month_weekday = first_day_of_next_month.weekday()
    delta = abs(wanted_day - first_day_of_next_month_weekday)
    next_month_first_occurence = first_day_of_next_month + timedelta(days=delta)


    if current_date <= second_occurence:
        return second_occurence
    elif current_date <= fourth_occurence:
        return fourth_occurence
    else:
        return next_month_first_occurence
@api_view(['GET'])
def next_delivery_date(request):
    current_date = datetime.now()
    next_date = date_finder(current_date)
    next_delivery_date = {
        'day': next_date.day,
        'month': next_date.strftime("%B"),
        'year': next_date.year,
    }
    return JsonResponse(next_delivery_date)

@csrf_exempt
@api_view(['POST'])
def stripe_hook(request):
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
        return handle_checkout_complete(event)
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
        current_user = User.objects.get(id=client_reference_id)
    except:
        return HttpResponse(status=400)

    try:
        customer_billing_info = BillingInfo.objects.get(customer=current_user)
    except:
        customer_billing_info = BillingInfo(customer=current_user)

    customer_billing_info.stripe_customer_id = stripe_customer_id
    customer_billing_info.save()
    return HttpResponse(status=200)
