from django.urls import include, path
from rest_framework import routers

from . import views


app_name = 'blogs'

urlpatterns = [
    path('', views.get_blogs),
    path('subscribe/', views.subscribe),
    path('check_sub_status/', views.get_subscription)
]