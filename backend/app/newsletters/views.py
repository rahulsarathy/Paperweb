from django.http import JsonResponse, HttpResponse
from django.core.validators import URLValidator
from django.core.exceptions import ValidationError
from django.core.cache import cache

from rest_framework.decorators import api_view
from rest_framework.exceptions import NotFound

import requests
import json
import threading
import logging
from bs4 import BeautifulSoup

@api_view(['POST'])
def add_newsletter(request):
    user = request.user

