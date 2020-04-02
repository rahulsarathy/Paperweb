import math

import json
from datetime import datetime, timedelta
import logging

from pulp.globals import STRIPE_PUBLIC_KEY
from utils.google_maps_utils import autocomplete
from utils import stripe_utils
from utils.stripe_utils import stripe, check_previous_customer, \
    db_user_paid, validate_subscription, check_payment_status, \
    stripe_db_user_paid
from payments.models import BillingInfo


from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.models import User
from django.views.decorators.cache import cache_page

# Create your views here.
@api_view(['GET'])
@login_required
def address_autocomplete(request):
    address = request.GET['address']
    autocompleted = autocomplete(address)

    return JsonResponse(autocompleted, safe=False)


@cache_page(60 * 15)
@api_view(['GET'])
@login_required
def get_stripe_public_key(request):
    return JsonResponse(STRIPE_PUBLIC_KEY, safe=False)


@api_view(['POST'])
def create_session(request):
    current_user = request.user
    user = request.user
    if not user.is_authenticated:
        return JsonResponse(data={'error': 'Invalid request.'}, status=403)
    if check_payment_status(current_user):
        return HttpResponse(status=403)
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

    user = request.user
    if not user.is_authenticated:
        return JsonResponse(data={'error': 'Invalid request.'}, status=403)

    user = request.user
    if check_payment_status(user):
        return HttpResponse(status=208)
    else:
        return HttpResponse(status=200)


@api_view(['POST'])
def cancel_payment(request):
    user = request.user
    if not user.is_authenticated:
        return JsonResponse(data={'error': 'Invalid request.'}, status=403)

    current_user = request.user
    try:
        billing_info = BillingInfo.objects.get(customer=current_user)
    except:
        return HttpResponse("User has no billing info", status=403)

    try:
        subscription_id = billing_info.stripe_subscription_id
        stripe_utils.delete_subscription(subscription_id)
        billing_info.stripe_subscription_id = None
        billing_info.save()
        return HttpResponse(status=200)
    except Exception as e:
        logging.warning("failed to cancel payment with {}".format(e))
        return HttpResponse(status=500)

@api_view(['GET'])
def next_billing_date(request):

    user = request.user
    if not user.is_authenticated:
        return JsonResponse(data={'error': 'Invalid request.'}, status=403)

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
    user = request.user
    if not user.is_authenticated:
        return JsonResponse(data={'error': 'Invalid request.'}, status=403)

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
    subscription_id = stripe_response.get('subscription')

    try:
        current_user = User.objects.get(id=client_reference_id)
    except:
        return HttpResponse(status=400)

    try:
        customer_billing_info = BillingInfo.objects.get(customer=current_user)
    except:
        customer_billing_info = BillingInfo(customer=current_user)

    customer_billing_info.stripe_customer_id = stripe_customer_id
    customer_billing_info.stripe_subscription_id = subscription_id
    customer_billing_info.save()
    return HttpResponse(status=200)
