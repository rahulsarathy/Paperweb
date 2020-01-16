from django.http import JsonResponse, HttpResponse
from django.core.validators import URLValidator
from django.core.exceptions import ValidationError
from django.core.cache import cache

from rest_framework.decorators import api_view
from rest_framework.exceptions import NotFound

from reading_list.serializers import ReadingListItemSerializer, ArticleSerializer
from reading_list.models import Article, ReadingListItem
from reading_list.reading_list_utils import get_parsed, html_to_s3, get_reading_list
import requests
import json
import threading
import logging
from bs4 import BeautifulSoup


CATEGORIES = ["Rationality", "Economics", "Technology", "Think Tanks"]

HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) '
                         'Chrome/41.0.2228.0 Safari/537.3'}

@api_view(['GET'])
def get_reading(request):
    user = request.user
    return get_reading_list(user)

@api_view(['POST'])
def add_to_reading_list(request):
    user = request.user
    link = request.POST['link']

    validate = URLValidator()
    try:
        validate(link)
    except ValidationError:
        return HttpResponse('Invalid URL', status=403)

    article_json = get_parsed(link)
    title = article_json.get('title')
    soup = BeautifulSoup(article_json.get('content', None), 'html.parser')
    article_text = soup.getText()
    article_json['parsed_text'] = article_text

    article, created = Article.objects.get_or_create(
         title=title, permalink=link, mercury_response=article_json
     )
    reading_list_item, created = ReadingListItem.objects.get_or_create(
        reader=user, article=article
    )

    try:
        upload_article = threading.Thread(target=html_to_s3, args=(link, user, article, article_json, ))
        upload_article.start()
    except:
        logging.warning("Threading failed")

    return get_reading_list(user, refresh=True)


@api_view(['GET'])
def get_archive(request):
    user = request.user
    my_reading = ReadingListItem.objects.filter(reader=user, archived=True).order_by('-date_added')
    serializer = ReadingListItemSerializer(my_reading, many=True)
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
        return get_reading_list(user, refresh=True)
    except ReadingListItem.DoesNotExist:
        raise NotFound(detail='ReadingListItem with link: %s not found.' % link, code=404)

@api_view(['POST'])
def remove_from_reading_list(request):
    user = request.user
    link = request.POST['link']
    try:
        article = Article.objects.get(permalink=link)
    except Article.DoesNotExist:
        raise NotFound(detail='Article not found', code=404)
    try:
        reading_list_item = ReadingListItem.objects.get(article=article, reader=user)
        reading_list_item.delete()
        return get_reading_list(user, refresh=True)
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
        return get_reading_list(user, refresh=True)
    except ReadingListItem.DoesNotExist:
        raise NotFound(detail='ReadingListItem with link: %s not found.' % link, code=404)

