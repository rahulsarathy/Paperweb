from django.urls import include, path
from rest_framework import routers

from . import views


app_name = 'pocket'

urlpatterns = [
    path('pocket', views.pocket),
    path('authenticate_pocket', views.authenticate_pocket),
]