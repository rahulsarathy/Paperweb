from django.http import JsonResponse, HttpResponse
from django.utils.timezone import make_aware
from datetime import datetime
from django.core.validators import URLValidator
from django.core.exceptions import ValidationError
from django.core.cache import cache

from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.exceptions import NotFound
from rest_framework.response import Response

from blogs.serializers import ReadingListItemSerializer, ArticleSerializer
from blogs.models import Subscription, Blog, Article, ReadingListItem
from utils.blog_utils import BLOGS, blog_map
from utils.s3_utils import put_object, check_file
import traceback
from newspaper import Article as NewspaperArticle
import lxml.html
import requests
import json
import os
import threading
import time
import logging
import string
from bs4 import BeautifulSoup
from urllib.request import urlopen, Request as req


CATEGORIES = ["Rationality", "Economics", "Technology", "Think Tanks"]

HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) '
                         'Chrome/41.0.2228.0 Safari/537.3'}

PAGE_CONSTANT = 1800

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
    try:
        subscriptions = Subscription.objects.filter(subscriber=current_user)
    except Exception as e:
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

def get_parsed(url):
    if url in cache:
        json_response = json.loads(cache.get(url))
        return json_response
    else:
        data = {'url': url}
        response = requests.post('http://pulp_node_1:3000/api/mercury', data=data)
        response_string = response.content.decode("utf-8")
        json_response = json.loads(response_string)
        cache.set(url, response_string)
    return json_response

def print_article(url, user, article, json_response):
    print("starting printing")
    id = hash(url)
    if check_file('{}.html'.format(id), 'pulppdfs'):
        logging.warning("File already uploaded, exiting")
        return

    date_string = None
    content = json_response.get('content')
    author = json_response.get('author')
    date_published = json_response.get('date_published')
    title = json_response.get('title')
    domain = json_response.get('domain')
    if date_published is not None:
        date_object = datetime.strptime(date_published[:10], '%Y-%m-%d')
        date_string = date_object.strftime('Originally published on %B %-d, %Y')

    template_soup = BeautifulSoup(open('./pdf/template.html'), 'html.parser')
    if title is not None:
        template_soup.select_one('.title').string = title
    if author is not None:
        template_soup.select_one('.author').string = 'By ' + author + ' on ' + domain
    if date_string is not None:
        template_soup.select_one('.date').string = date_string

    soup = BeautifulSoup(content, 'html.parser')
    template_soup.select_one('.main-content').insert(0, soup)
    id = hash(url)
    f = open("./{}.html".format(id), "w+")
    f.write(str(template_soup))
    f.close()

    metadata = {
        'url': url
    }
    put_object('pulppdfs', "{}.html".format(id), "./{}.html".format(id), metadata)
    os.remove("./{}.html".format(id))

    words = len(soup.getText())
    article.words = words
    article.save()
    ReadingListItem.objects.get_or_create(
        reader=user, article=article
    )
    return

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

    article_json = get_parsed(link)
    title = article_json.get('title')
    excerpt = article_json.get('excerpt')


    article, created = Article.objects.get_or_create(
         title=title, permalink=link, excerpt=excerpt
     )
    reading_list_item, created = ReadingListItem.objects.get_or_create(
        reader=user, article=article
    )

    try:
        upload_article = threading.Thread(target=print_article, args=(link, user, article, article_json, ))
        print("Starting thread")
        upload_article.start()
    except:
        logging.warning("Threading failed")

    my_reading = ReadingListItem.objects.filter(reader=user)
    serializer = ReadingListItemSerializer(my_reading, many=True)
    return JsonResponse(serializer.data, safe=False)

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

        my_reading = ReadingListItem.objects.filter(reader=user)
        serializer = ReadingListItemSerializer(my_reading, many=True)
        return JsonResponse(serializer.data, safe=False)
    except ReadingListItem.DoesNotExist:
        print("this is exception!")
        raise NotFound(detail='ReadingListItem with link: %s not found.' % link, code=404)

@api_view(['POST'])
def get_html(request):
    user = request.user
    if not user.is_authenticated:
        return HttpResponse(status=403)
    url = request.POST['url']
    if url in cache:
        json_response = json.loads(cache.get(url))
    else:
        # Check S3

        data = {'url': url}
        response = requests.post('http://pulp_node_1:3000/api/mercury', data=data)
        response_string = response.content.decode("utf-8")
        json_response = json.loads(response_string)
        cache.set(url, response_string)
    return JsonResponse(json_response)
