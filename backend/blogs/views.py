from django.http import JsonResponse, HttpResponse
from django.utils.timezone import make_aware
from datetime import datetime
from django.core.validators import URLValidator
from django.core.exceptions import ValidationError
from django.core.cache import cache

from rest_framework.decorators import api_view
from rest_framework import viewsets
from rest_framework.response import Response

from blogs.serializers import ReadingListItemSerializer, ArticleSerializer
from blogs.models import Subscription, Blog, Article, ReadingListItem
from utils.blog_utils import BLOGS, blog_map
import traceback
from newspaper import Article as NewspaperArticle
import lxml.html
import requests
import json
import os


CATEGORIES = ["Rationality", "Economics", "Technology", "Think Tanks"]

HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) '
                         'Chrome/41.0.2228.0 Safari/537.3'}

@api_view(['GET'])
def get_blogs(request):
    if not request.user.is_authenticated:
        return HttpResponse(status=403)
    all_blogs = []
    for blog in BLOGS:
        new_blog = blog()
        all_blogs.append(new_blog.to_json())

    return JsonResponse(all_blogs, safe=False)

@api_view(['GET'])
def get_posts(request):
    user = request.user
    subscriptions = Subscription.objects.filter(subscriber=user)
    posts = []
    for subscription in subscriptions:
        sub_blog = subscription.blog
        blog_posts = Article.objects.filter(blog=sub_blog)
        posts.extend(blog_posts)

    # Grab all posts from database
    # Sort them by date_published
    posts.sort(key=lambda x: x.date_published, reverse=True)
    date_map = {

    }
    # for each post manually serialize them
    for post in posts:
        serializer = ArticleSerializer(post)
        # group posts within a date_map where dates are keys and posts are values
        if str(post.date_published.date()) in date_map.keys():
            date_map[str(post.date_published.date())].append(serializer.data)
        else:
            date_map[str(post.date_published.date())] = [serializer.data]

    return JsonResponse(date_map)

@api_view(['POST'])
def check_sub_status(request):
    user = request.user
    name_id = request.POST['name_id']
    try:
        blog = Blog.objects.get(name=name_id)
    except:
        return JsonResponse(False, safe=False)

    try:
        curr_subscription = Subscription.objects.get(subscriber=user, blog=blog)
    except Subscription.DoesNotExist:
        return JsonResponse(False, safe=False)
    except Subscription.MultipleObjectsReturned:
        return HttpResponse(status=500)

    # Already subscribed
    return JsonResponse(True, safe=False)

@api_view(['GET'])
def get_subscriptions(request):
    current_user = request.user
    print("user is ", current_user)
    try:
        subscriptions = Subscription.objects.filter(subscriber=current_user)
        print(subscriptions)
    except Exception as e:
        print(str(e))
        return JsonResponse({})

    blogs = []
    for subscription in subscriptions:
        subscribed_blog = subscription.blog
        blog_object = blog_map(subscribed_blog.name)
        blogs.append(blog_object().to_json())

    return JsonResponse(blogs, safe=False)

@api_view(['POST'])
def subscribe(request):
    user = request.user
    name_id = request.POST['name_id']

    try:
        subscriptions = Subscription.objects.filter(subscriber=user)
    except Exception as e:
        print(str(e))
        return HttpResponse(status=400)

    # if len(subscriptions) == 8:
    #     return HttpResponse(status=400)

    try:
        blog = Blog.objects.get(name=name_id)
    except:
        traceback.print_exc()
        return HttpResponse(status=500)
    try:
        new_subscription = Subscription(subscriber=user, blog=blog)
        new_subscription.save()
    except:
        return HttpResponse(status=403)

    return HttpResponse(status=200)

@api_view(['POST'])
def unsubscribe(request):
    user = request.user
    name_id = request.POST['name_id']
    blog = Blog.objects.get(name=name_id)
    try:
        old_subscription = Subscription.objects.get(subscriber=user, blog=blog)
    except Subscription.DoesNotExist:
        return HttpResponse(status=403)
    except Subscription.MultipleObjectsReturned:
        return HttpResponse(status=500)

    old_subscription.delete()
    return HttpResponse(status=200)

@api_view(['GET'])
def get_reading_list(request):
    user = request.user
    my_reading = ReadingListItem.objects.filter(reader=user)
    serializer = ReadingListItemSerializer(my_reading, many=True)
    return JsonResponse(serializer.data, safe=False)

@api_view(['POST'])
def add_to_reading_list(request):
    user = request.user
    link = request.POST['link']

    validate = URLValidator()
    try:
        validate(link)
    except ValidationError:
        print("invalid url")
        return HttpResponse('Invalid URL', status=403)

    now = make_aware(datetime.now())
    try:
        new_article = NewspaperArticle(link)
        new_article.download()
        new_article.parse()
        title = new_article.title
    except:
        t = lxml.html.parse(link)
        title = t.find(".//title")
        if title is None:
            title = ''

    reading_list_item, created = ReadingListItem.objects.get_or_create(
        link=link, reader=user, title=title, defaults={'date_added': now})
    if not created:
        return JsonResponse({})
    serializer = ReadingListItemSerializer(reading_list_item)

    return JsonResponse(serializer.data)

@api_view(['POST'])
def remove_from_reading_list(request):
    user = request.user
    link = request.POST['link']
    reading_list_item, created = ReadingListItem.objects.get_or_create(link=link, reader=user)
    reading_list_item.delete()

    my_reading = ReadingListItem.objects.filter(reader=user)
    serializer = ReadingListItemSerializer(my_reading, many=True)
    return JsonResponse(serializer.data, safe=False)


@api_view(['POST'])
def get_html(request):
    user = request.user
    if not user.is_authenticated:
        return HttpResponse(status=403)
    url = request.POST['url']

    data = {'url': 'goog'}
    response = requests.post('http://pulp_node_1:3000/api/mercury', data=data)
    print(response)
    return HttpResponse(status=200)