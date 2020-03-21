
from django.shortcuts import render
from rest_framework.decorators import api_view
from django.http import JsonResponse, HttpResponse, HttpResponseRedirect
from pulp.globals import POCKET_CONSUMER_KEY, INSTAPAPER_CONSUMER_ID, INSTAPAPER_CONSUMER_SECRET
from .models import InstapaperCredentials
from .tasks import parse_instapaper_bookmarks

from requests_oauthlib import OAuth1
import requests
import urllib
from django.utils import timezone
from rest_framework import status

# Create your views here.

@api_view(['POST'])
def sync_instapaper(request):

    user = request.user
    if not user.is_authenticated:
        return JsonResponse(data={'error': 'Invalid request.'}, status=403)

    try:
        credentials = InstapaperCredentials.objects.get(owner=user)
    except InstapaperCredentials.DoesNotExist:
        return JsonResponse(data={'error': 'Invalid Instapaper Credentials.'}, status=403)
    if credentials.invalid:
        return HttpResponse(status=401)
    parse_instapaper_bookmarks.delay(user.email)
    now = timezone.now()
    return JsonResponse(now, safe=False)

@api_view(['POST'])
def remove_instapaper(request):
    user = request.user
    if not user.is_authenticated:
        return JsonResponse(data={'error': 'Invalid request.'}, status=403)

    try:
        credentials = InstapaperCredentials.objects.get(owner=user)
    except InstapaperCredentials.DoesNotExist:
        return JsonResponse(data={'error': 'Could not find pocket credentials.'}, status=403)
    credentials.delete()
    return HttpResponse(status=200)

@api_view(['POST'])
def authenticate_instapaper(request):
    user = request.user
    if not user.is_authenticated:
        return JsonResponse(data={'error': 'Invalid request.'}, status=403)

    username = request.POST['username']
    password = request.POST['password']

    user = request.user
    authenticate_url = 'https://www.instapaper.com/api/1/oauth/access_token'
    oauth = OAuth1(client_key=INSTAPAPER_CONSUMER_ID, client_secret=INSTAPAPER_CONSUMER_SECRET)
    data = {
        'x_auth_username': username,
        'x_auth_password': password,
        'x_auth_mode': 'client_auth',
    }

    response = requests.post(authenticate_url, data=data, auth=oauth)
    if response.status_code != 200:
        return HttpResponse(status=401)

    text = response.text
    parsed = urllib.parse.parse_qs(text)
    oauth_token_secret = parsed['oauth_token_secret'][0]
    oauth_token = parsed['oauth_token'][0]

    try:
        credentials = InstapaperCredentials.objects.get(owner=user)
    except InstapaperCredentials.DoesNotExist:
        credentials = InstapaperCredentials(owner=user)

    credentials.oauth_token = oauth_token
    credentials.oauth_token_secret = oauth_token_secret
    credentials.invalid = False
    credentials.save()

    parse_instapaper_bookmarks.delay(user.email)

    return HttpResponse(status=200)