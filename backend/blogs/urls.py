from django.urls import include, path
from rest_framework import routers

from . import views


app_name = 'blogs'

urlpatterns = [
    path('add_reading', views.add_to_reading_list),
    path('get_reading', views.get_reading),
    path('remove_reading', views.remove_from_reading_list),
]