import logging
import json
import re

from rest_framework.decorators import api_view
from blogs.models import Blog, BlogCategory


from requests_oauthlib import OAuth1
import requests
import urllib
import vcr
from django.core.exceptions import ValidationError



# Create your views here.

@api_view(['GET'])
def get_blogs(request):
	blogs = Blog.objects.all()
	for blog in blogs:
		categories = BlogCategory.objects.all()
		for category in categories:
			pass


@api_view(['POST'])
def subscribe(request):
	pass

@api_view(['POST'])
def unsubscribe(request):
	pass