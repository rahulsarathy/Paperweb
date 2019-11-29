from django.urls import include, path
from rest_framework import routers

from . import views

app_name = 'users'
urlpatterns = [
    # path('', include(router.urls)),
    path('get_address/', views.get_address),
    path('set_address/', views.set_address),
    path('get_invite_codes/', views.get_invite_codes),
]