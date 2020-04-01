import logging

import stripe
from pulp.globals import STRIPE_API_KEY, NGROK_HOST, PULP_STRIPE_PLAN
from payments.models import BillingInfo

stripe.api_key = STRIPE_API_KEY

# Setup Stripe Webhook
# for webhook in stripe.WebhookEndpoint.list(limit=16).data:
#     id = webhook.get("id")
#     stripe.WebhookEndpoint.delete(id)
# stripe_webhook_url = 'https://' + NGROK_HOST + '/api/payments/stripehook/'
# stripe.WebhookEndpoint.create(url=stripe_webhook_url, enabled_events=['checkout.session.completed'])
#

def create_session(client_reference_id, customer_email=None, stripe_customer_id=None):
    pulp_url = 'https://getpulp.io'
    session = stripe.checkout.Session.create(
        payment_method_types=['card'],
        subscription_data={
            'items': [{
                'plan': PULP_STRIPE_PLAN,
            }],
            'payment_behavior': 'allow_incomplete'
        },
        success_url=pulp_url,
        cancel_url=pulp_url,
        client_reference_id=client_reference_id,
        customer_email=customer_email,
        customer=stripe_customer_id,
    )

    return session

def check_previous_customer(email):
    previous_customer = stripe.Customer.list(email=email)
    if previous_customer.data == []:
        return None
    else:
        data = previous_customer.data
        if len(data) > 1:
            logging.warning('Email: {} has more than one stripe customer'.format(email))
        return data[0]

def check_payment_status(user):
    if db_user_paid(user):
        return True

    if stripe_db_user_paid(user):
        return True
    else:
        return False

def stripe_db_user_paid(user):
    email = user.email
    previous_customer = stripe.Customer.list(email=email)
    if previous_customer.data == []:
        return False
    else:
        data = previous_customer.data
        if len(data) > 1:
            logging.warning('Email: {} has more than one stripe customer'.format(email))
        subscription_id = data[0]['subscriptions']['data'][0]['id']
        subscription_validated = validate_subscription(subscription_id)

        if subscription_validated:
            try:
                billing_info = BillingInfo.objects.get(customer=user)
                billing_info.stripe_subscription_id = subscription_id
                billing_info.stripe_customer_id = data[0]['id']
                billing_info.save()
            except BillingInfo.DoesNotExist:
                BillingInfo(customer=user, stripe_customer_id=data[0]['id'], stripe_subscription_id=subscription_id).save()
        return subscription_validated

# checks if the DB has confirmation on whether user has paid or not
def db_user_paid(user):

    try:
        current_billing_info = BillingInfo.objects.get(customer=user)
        subscription_id = current_billing_info.stripe_subscription_id
        return validate_subscription(subscription_id)
    except BillingInfo.DoesNotExist:
        return False

def validate_subscription(subscription_id):

    to_validate = stripe.Subscription.retrieve(subscription_id)
    return to_validate['plan']['active']


def retrieve_customer(stripe_customer_id):
    stripe_customer = stripe.Customer.retrieve(stripe_customer_id)
    return stripe_customer

def delete_subscription(subscription_id):
    stripe.Subscription.delete(subscription_id)