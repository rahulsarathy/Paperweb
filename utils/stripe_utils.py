import stripe
from siteconfig.globals import STRIPE_API_KEY, STRIPE_WEBHOOK_URL

stripe.api_key = STRIPE_API_KEY

# Setup Stripe Webhook
for webhook in stripe.WebhookEndpoint.list(limit=16).data:
    id = webhook.get("id")
    stripe.WebhookEndpoint.delete(id)
stripe.WebhookEndpoint.create(url=STRIPE_WEBHOOK_URL, enabled_events=['checkout.session.completed'])


def create_session(client_reference_id, customer_email):
    session = stripe.checkout.Session.create(
        payment_method_types=['card'],
        subscription_data={
            'items': [{
                'plan': 'plan_FpKS1u80kRynhr',
            }],
        },
        success_url='https://example.com/success',
        cancel_url='https://example.com/cancel',
        client_reference_id=client_reference_id,
        customer_email=customer_email
    )

    return session

def retrieve_customer(stripe_customer_id):
    stripe.Customer.retrieve(customer_id)
