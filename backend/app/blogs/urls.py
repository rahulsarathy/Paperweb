from django.urls import include, path
from rest_framework import routers

from . import views


app_name = 'blogs'

urlpatterns = [
	path('get_blogs/', views.get_blogs, name='get_blogs'),
	path('subscribe/', views.subscribe, name='subscribe'),
	path('unsubscribe/', views.unsubscribe, name='unsubscribe'),
]