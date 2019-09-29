from django.urls import include, path
from rest_framework import routers

from . import views


app_name = 'payments'

urlpatterns = [
    path('create_session/', views.create_session),
    path('payment_status/', views.payment_status),
    path('cancel_payment/', views.cancel_payment),
    path('stripehook/', views.stripe_hook),
    path('next_billing_date/', views.next_billing_date),
    path('next_delivery_date/', views.next_delivery_date)
]