from django.urls import include, path
from rest_framework import routers

from . import views


app_name = 'instapaper'

urlpatterns = [
    path('authenticate_instapaper', views.authenticate_instapaper),
    path('sync_instapaper', views.sync_instapaper),
    path('remove_instapaper', views.remove_instapaper),

]