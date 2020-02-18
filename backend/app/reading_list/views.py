from django.http import JsonResponse, HttpResponse, HttpResponseRedirect
from django.core.cache import cache

from rest_framework.decorators import api_view
from rest_framework.exceptions import NotFound

from reading_list.serializers import ReadingListItemSerializer
from reading_list.models import Article, ReadingListItem
from reading_list.reading_list_utils import get_parsed, html_to_s3, get_reading_list, add_to_reading_list
from reading_list.instapaper import import_from_instapaper
from reading_list.tasks import import_pocket
import json
import requests
from django.shortcuts import redirect
from pulp.globals import POCKET_CONSUMER_KEY
import re
from django.utils.timezone import make_aware
from datetime import datetime

@api_view(['GET'])
def get_reading(request):
    user = request.user
    # all = request.GET['all']
    if not user.is_authenticated:
        return JsonResponse(data={'error': 'Invalid request.'}, status=403)
    return get_reading_list(user)

# 1. Validate URL
# 2. Parse article content
# 3. Add Article to DB
# 4. Create new thread that uploads article HTML to S3 Bucket
# 5. Return new reading list to user while threaded process runs
@api_view(['POST'])
def handle_add_to_reading_list(request):
    user = request.user
    if not user.is_authenticated:
        return JsonResponse(data={'error': 'Invalid request.'}, status=403)
    link = request.POST['link']
    add_to_reading_list(user, link)
    return get_reading_list(user)

@api_view(['GET'])
def get_archive(request):
    user = request.user
    my_archive = ReadingListItem.objects.filter(reader=user, archived=True).order_by('-date_added')
    serializer = ReadingListItemSerializer(my_archive, many=True)
    json_response = serializer.data
    return JsonResponse(json_response, safe=False)


@api_view(['POST'])
def archive_item(request):
    user = request.user
    link = request.POST['link']
    try:
        article = Article.objects.get(permalink=link)
    except Article.DoesNotExist:
        raise NotFound(detail='Article not found', code=404)
    try:
        reading_list_item = ReadingListItem.objects.get(article=article, reader=user)
        reading_list_item.archived = True
        reading_list_item.save()
        key = 'archive' + user.email
        cache.delete(key)
        return get_reading_list(user)
    except ReadingListItem.DoesNotExist:
        raise NotFound(detail='ReadingListItem with link: %s not found.' % link, code=404)

@api_view(['POST'])
def unarchive(request):
    user = request.user
    link = request.POST['link']
    try:
        article = Article.objects.get(permalink=link)
    except Article.DoesNotExist:
        raise NotFound(detail='Article not found', code=404)
    try:
        reading_list_item = ReadingListItem.objects.get(article=article, reader=user)
        reading_list_item.archived = False
        reading_list_item.save()
        return get_cache_archive(user=user, refresh=True)
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
        return get_reading_list(user)
    except ReadingListItem.DoesNotExist:
        raise NotFound(detail='ReadingListItem with link: %s not found.' % link, code=404)


@api_view(['POST'])
def update_deliver(request):
    user = request.user
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


@api_view(['POST'])
def pocket(request):
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
    return HttpResponse(url)


def authenticate_pocket(request):
    key = request.user.email + 'pocket'
    code = cache.get(key)
    url = 'https://getpocket.com/v3/oauth/authorize'
    data = {'consumer_key': POCKET_CONSUMER_KEY, 'code': code}
    response = requests.post(url, data=data)
    response_string = response.text
    result = re.search('access_token=(.*)&username', response_string)
    access_token = result.group(1)

    url = 'https://getpocket.com/v3/get'
    data = {'consumer_key': POCKET_CONSUMER_KEY, 'access_token': access_token, 'state': 'unread'}
    response = requests.post(url, data=data)
    response_string = response.content.decode("utf-8")
    json_response = json.loads(response_string)
    articles = json_response.get('list')
    import_pocket.delay(request.user.email, articles)

    return HttpResponseRedirect('/settings/?pocket=true')

@api_view(['POST'])
def start_instapaper_import(request):
    user = request.user
    username = request.POST['username']
    password = request.POST['password']
    return import_from_instapaper(user, username, password)

