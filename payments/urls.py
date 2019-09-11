from django.urls import include, path
from rest_framework import routers

from . import views


app_name = 'payments'

urlpatterns = [
    path('/address_autocomplete', views.address_autocomplete),
    path('/get_address', views.get_address),
    path('/set_address', views.set_address),
]