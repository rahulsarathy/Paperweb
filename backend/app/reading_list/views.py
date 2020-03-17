from datetime import datetime
import json
import re

from reading_list.serializers import ReadingListItemSerializer, PocketCredentialsSerializer, \
    InstapaperCredentialsSerializer
from reading_list.models import Article, ReadingListItem, PocketCredentials, InstapaperCredentials
from reading_list.utils import get_parsed, html_to_s3, get_reading_list, \
    add_to_reading_list, retrieve_pocket, get_archive_list
from reading_list.instapaper import import_from_instapaper
from reading_list.tasks import import_pocket, parse_instapaper_bookmarks
from pulp.globals import POCKET_CONSUMER_KEY, INSTAPAPER_CONSUMER_ID, INSTAPAPER_CONSUMER_SECRET

from rest_framework.decorators import api_view
from rest_framework.exceptions import NotFound
from django.shortcuts import redirect
from django.utils.timezone import make_aware
from django.core.exceptions import ValidationError
from django.http import JsonResponse, HttpResponse, HttpResponseRedirect
from django.core.cache import cache
from django.utils import timezone
import requests
from requests_oauthlib import OAuth1
import urllib


@api_view(['GET'])
def get_reading(request):
    user = request.user
    if not user.is_authenticated:
        return JsonResponse(data={'error': 'Invalid request.'}, status=403)
    return get_reading_list(user)


@api_view(['POST'])
def handle_add_to_reading_list(request):
    user = request.user
    if not user.is_authenticated:
        return JsonResponse(data={'error': 'Invalid request.'}, status=403)
    link = request.POST['link']

    # handle validation error
    try:
        add_to_reading_list(user, link)
    except ValidationError:
        return JsonResponse(data={'error': 'Invalid URL.'}, status=400)

    return get_reading_list(user)


@api_view(['GET'])
def get_archive(request):
    user = request.user
    if not user.is_authenticated:
        return JsonResponse(data={'error': 'Invalid request.'}, status=403)
    return get_archive_list(user)


@api_view(['POST'])
def archive_item(request):
    user = request.user
    if not user.is_authenticated:
        return JsonResponse(data={'error': 'Invalid request.'}, status=403)
    link = request.POST['link']
    try:
        article = Article.objects.get(permalink=link)
    except Article.DoesNotExist:
        raise NotFound(detail='Article not found', code=404)
    try:
        reading_list_item = ReadingListItem.objects.get(article=article, reader=user)
        reading_list_item.archived = True
        reading_list_item.save()
        return get_reading_list(user)
    except ReadingListItem.DoesNotExist:
        raise NotFound(detail='ReadingListItem with link: %s not found.' % link, code=404)

@api_view(['POST'])
def unarchive(request):
    user = request.user
    if not user.is_authenticated:
        return JsonResponse(data={'error': 'Invalid request.'}, status=403)
    link = request.POST['link']
    try:
        article = Article.objects.get(permalink=link)
    except Article.DoesNotExist:
        raise NotFound(detail='Article not found', code=404)
    try:
        reading_list_item = ReadingListItem.objects.get(article=article, reader=user)
        reading_list_item.archived = False
        reading_list_item.save()
        return get_archive_list(user)
    except ReadingListItem.DoesNotExist:
        raise NotFound(detail='Archived Reading List Item with link: %s not found.' % link, code=404)


@api_view(['POST'])
def remove_from_reading_list(request):
    user = request.user
    if not user.is_authenticated:
        return JsonResponse(data={'error': 'Invalid request.'}, status=403)

    link = request.POST['link']
    try:
        article = Article.objects.get(permalink=link)
    except Article.DoesNotExist:
        raise NotFound(detail='Article not found', code=404)
    try:
        reading_list_item = ReadingListItem.objects.get(article=article, reader=user)
        reading_list_item.delete()
    except ReadingListItem.DoesNotExist:
        raise NotFound(detail='ReadingListItem with link: %s not found.' % link, code=404)

    # Remove from instapaper sync
    try:
        credentials = InstapaperCredentials.objects.get(owner=user)
        polled_bookmarks = credentials.polled_bookmarks
        polled_bookmarks.pop(link, None)
        credentials.save()
    except InstapaperCredentials.DoesNotExist:
        # nothing to remove
        pass
    return get_reading_list(user)


@api_view(['POST'])
def update_deliver(request):
    user = request.user

    if not user.is_authenticated:
        return JsonResponse(data={'error': 'Invalid request.'}, status=403)

    link = request.POST['permalink']
    to_deliver = request.POST.get('to_deliver') == 'true'
    # Get Article to get Reading list item
    try:
        article = Article.objects.get(permalink=link)
    except Article.DoesNotExist:
        raise NotFound(detail='Article not found', code=404)
    try:
        reading_list_item = ReadingListItem.objects.get(article=article, reader=user)
        reading_list_item.to_deliver = to_deliver
        reading_list_item.save()
        return get_reading_list(user)
    except ReadingListItem.DoesNotExist:
        raise NotFound(detail='ReadingListItem with link: %s not found.' % link, code=404)


# Tell the user whether they have integrated reading list services
@api_view(['GET'])
def service_status(request):
    user = request.user
    if not user.is_authenticated:
        return JsonResponse(data={'error': 'Invalid request.'}, status=403)

    response = {
        'instapaper': {"signed_in": False},
        'pocket': {"signed_in": False},
    }
    try:
        credentials = InstapaperCredentials.objects.get(owner=user)
        instapaper_serializer = InstapaperCredentialsSerializer(credentials)
        response['instapaper'] = instapaper_serializer.data
        response['instapaper']['signed_in'] = True
    except InstapaperCredentials.DoesNotExist:
        response['instapaper']['signed_in'] = False
    try:
        credentials = PocketCredentials.objects.get(owner=user)
        pocket_serializer = PocketCredentialsSerializer(credentials)
        response['pocket'] = pocket_serializer.data
        response['pocket']['signed_in'] = True
    except PocketCredentials.DoesNotExist:
        response['pocket']['signed_in'] = False

    return JsonResponse(response)


# Method is triggered when user starts pocket integration from frontend modal
@api_view(['POST'])
def pocket(request):
    user = request.user
    if not user.is_authenticated:
        return JsonResponse(data={'error': 'Invalid request.'}, status=403)
    # Get pocket code from consumer key
    redirect_uri = 'http://127.0.0.1:8000/api/reading_list/authenticate_pocket'
    url = 'https://getpocket.com/v3/oauth/request'
    data = {'consumer_key': POCKET_CONSUMER_KEY, 'redirect_uri': redirect_uri}
    response = requests.post(url, data=data)
    response_string = response.text
    code = response_string.partition("code=")[2]

    url = 'https://getpocket.com/auth/authorize?request_token={code}&redirect_uri=' \
          '{redirect_uri}'.format(code=code, redirect_uri=redirect_uri)
    key = request.user.email + 'pocket'
    cache.set(key, code)
    # Send the user a url w/ code that links the user to our consumer key
    # User will redirect to this URL
    return HttpResponse(url)


# this method is hit as a webhook
def authenticate_pocket(request):
    user = request.user
    if not user.is_authenticated:
        return JsonResponse(data={'error': 'Invalid request.'}, status=403)
    # Get code linking user to our consumer key from cache
    key = user.email + 'pocket'
    code = cache.get(key)

    # get access token for user
    url = 'https://getpocket.com/v3/oauth/authorize'
    data = {'consumer_key': POCKET_CONSUMER_KEY, 'code': code}
    response = requests.post(url, data=data)
    response_string = response.text
    result = re.search('access_token=(.*)&username', response_string)
    access_token = result.group(1)

    articles = retrieve_pocket(user, access_token)
    import_pocket.delay(request.user.email, articles)

    return HttpResponseRedirect('/')

@api_view(['POST'])
def start_instapaper_import(request):
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
    credentials.save()

    parse_instapaper_bookmarks.delay(user.email)

    return HttpResponse(status=200)