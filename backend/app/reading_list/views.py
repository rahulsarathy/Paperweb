from django.http import JsonResponse, HttpResponse
from django.core.cache import cache

from rest_framework.decorators import api_view
from rest_framework.exceptions import NotFound

from reading_list.serializers import ReadingListItemSerializer
from reading_list.models import Article, ReadingListItem
from reading_list.reading_list_utils import get_parsed, html_to_s3, get_reading_list, add_to_reading_list
from reading_list.instapaper import import_from_instapaper

CATEGORIES = ["Rationality", "Economics", "Technology", "Think Tanks"]

HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) '
                         'Chrome/41.0.2228.0 Safari/537.3'}

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
def start_instapaper_import(request):
    user = request.user
    username = request.POST['username']
    password = request.POST['password']
    # return HttpResponse(status=200)
    return import_from_instapaper(user, username, password)

