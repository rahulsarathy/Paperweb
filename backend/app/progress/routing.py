# progress/routing.py
from django.urls import path
from . import consumers
from django.urls import re_path

websocket_urlpatterns = [
    path('ws/api/progress/', consumers.ProgressConsumer),
]