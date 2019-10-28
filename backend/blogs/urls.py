from django.urls import include, path
from rest_framework import routers

from . import views


app_name = 'blogs'

urlpatterns = [
    path('', views.get_blogs),
    path('subscribe/', views.subscribe),
    path('check_sub_status/', views.check_sub_status),
    path('unsubscribe/', views.unsubscribe),
    path('get_subscriptions', views.get_subscriptions),
    path('get_posts', views.get_posts),
    path('add_reading', views.add_to_reading_list),
    path('get_reading', views.get_reading_list),
    path('remove_reading', views.remove_from_reading_list),
]