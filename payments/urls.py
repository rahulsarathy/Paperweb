from django.urls import include, path
from rest_framework import routers

from . import views


app_name = 'payments'

urlpatterns = [
    path('create_session/', views.create_session),
    path('payment_status/', views.payment_status),
    path('cancel_payment/', views.cancel_payment),
    path('stripehook/', views.stripe_hook)
]