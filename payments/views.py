from django.shortcuts import render
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from utils.google_maps_utils import autocomplete
from utils import stripe_utils
from utils.stripe_utils import stripe
from django.http import JsonResponse, HttpResponse
from payments.models import Transaction
import json

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

@csrf_exempt
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
        print(event)

    # Handle the event
    if event.type == 'payment_intent.succeeded':
        payment_intent = event.data.object  # contains a stripe.PaymentIntent
        # handle_payment_intent_succeeded(payment_intent)
    elif event.type == 'payment_method.attached':
        payment_method = event.data.object  # contains a stripe.PaymentMethod
        # handle_payment_method_attached(payment_method)
    # ... handle other event types
    else:
        # Unexpected event type
        return HttpResponse(status=400)

    return HttpResponse(status=200)