from django.shortcuts import render
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from utils.google_maps_utils import autocomplete
from utils import stripe_utils
from utils.stripe_utils import stripe
from django.http import JsonResponse, HttpResponse
from payments.models import Transaction, BillingInfo
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
        latest_transaction = Transaction.objects.filter(customer=current_user).latest()
    except:
        latest_transaction = None

    if latest_transaction and not latest_transaction.payment_cancellation:
        return HttpResponse(status=208)

    new_session = stripe_utils.create_session(current_user.id, current_user.email)
    return JsonResponse(new_session)

@api_view(['GET'])
def payment_status(request):
    current_user = request.user
    try:
        latest_transaction = Transaction.objects.filter(customer=current_user).latest()
    except:
        latest_transaction = None

    if latest_transaction and not latest_transaction.payment_cancellation:
        return HttpResponse(status=208)
    else:
        return HttpResponse(status=204)

    return HttpResponse(status=200)

@api_view(['GET'])
def cancel_payment(request):
    current_user = request.user
    try:
        latest_transaction = Transaction.objects.filter(customer=current_user).latest()
    except:
        latest_transaction = None

    if latest_transaction and not latest_transaction.payment_cancellation:
        cancel_transaction = Transaction(make_aware(datetime.now()), customer=current_user, payment_cancellation=True)
        cancel_transaction.save()
        return HttpResponse(status=200)
    else:
        return HttpResponse("User has no subscription", status=402)

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

    customer_billing_info = BillingInfo.objects.get(customer=client_reference_id)
    customer_billing_info.stripe_customer_id = stripe_customer_id
    customer_billing_info.save()

    new_transaction = Transaction(transaction_date=make_aware(datetime.now()), customer=client_reference_id, payment_cancellation=False)

