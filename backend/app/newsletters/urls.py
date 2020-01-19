from django.urls import include, path
from rest_framework import routers

from . import views


app_name = 'newsletters'

urlpatterns = [
    path('add_newsletter', views.add_newsletter),
]