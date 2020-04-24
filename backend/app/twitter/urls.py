from django.urls import include, path
from rest_framework import routers

from . import views


app_name = 'twitter'

urlpatterns = [
	path('start_authentication/', views.start_authentication, name='start_authentication'),
	path('authenticate/', views.authenticate, name='authenticate'),
	path('get_timeline/', views.get_timeline_request, name='get_timeline'),

]