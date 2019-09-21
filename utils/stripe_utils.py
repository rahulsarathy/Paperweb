import stripe
from siteconfig.globals import STRIPE_API_KEY, NGROK_HOST, PULP_STRIPE_PLAN

stripe.api_key = STRIPE_API_KEY

# Setup Stripe Webhook
for webhook in stripe.WebhookEndpoint.list(limit=16).data:
    id = webhook.get("id")
    stripe.WebhookEndpoint.delete(id)
stripe_webhook_url = 'https://' + NGROK_HOST + '/api/payments/stripehook/'
stripe.WebhookEndpoint.create(url=stripe_webhook_url, enabled_events=['checkout.session.completed'])


def create_session(client_reference_id, customer_email, stripe_customer_id=None):
    session = stripe.checkout.Session.create(
        payment_method_types=['card'],
        subscription_data={
            'items': [{
                'plan': PULP_STRIPE_PLAN,
            }],
        },
        success_url='https://example.com/success',
        cancel_url='https://example.com/cancel',
        client_reference_id=client_reference_id,
        customer_email=customer_email,
        customer=stripe_customer_id
    )

    return session

def retrieve_customer(stripe_customer_id):
    stripe_customer = stripe.Customer.retrieve(stripe_customer_id)
    return stripe_customer

def delete_customer(subscription_id):
    stripe.Subscription.delete(subscription_id)