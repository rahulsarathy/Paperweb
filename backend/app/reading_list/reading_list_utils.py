from django.core.cache import cache
import json
import requests
from utils.s3_utils import put_object, check_file
from reading_list.models import ReadingListItem, Article
from bs4 import BeautifulSoup
from datetime import datetime
import logging
import os
from django.http import JsonResponse
from reading_list.serializers import ReadingListItemSerializer
from django.core.cache import cache
from django.conf import settings


def get_reading_list(user, refresh=False):
    key = 'reading_list' + user.email
    if refresh is False and key in cache:
        json_response = cache.get(key)
    else:
        my_reading = ReadingListItem.objects.filter(reader=user, archived=False).order_by('-date_added')
        serializer = ReadingListItemSerializer(my_reading, many=True)
        json_response = serializer.data
        cache.set(key, serializer.data)
    return JsonResponse(json_response, safe=False)

# Check for mercury response in
# 1. cache
# 2. DB
# 3. create mercury response
def get_parsed(url):
    if url in cache:
        json_response = json.loads(cache.get(url))
        return json_response
    else:
        try:
            # check if mercury response is already stored in DB
            my_article = Article.objects.get(permalink=url)
            json_response = my_article.mercury_response
        except Article.DoesNotExist:
            data = {'url': url}
            parser_url = 'http://{}:3000/api/mercury'.format(settings.PARSER_HOST)
            response = requests.post(parser_url, data=data)
            response_string = response.content.decode("utf-8")
            json_response = json.loads(response_string)
            cache.set(url, response_string)
    return json_response


# Create HTML file for article 3 column format and store in AWS S3
def html_to_s3(url, user, article, json_response):
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
    word_count = json_response.get('word_count')
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

    article.word_count = word_count
    article.save()
    ReadingListItem.objects.get_or_create(
        reader=user, article=article
    )
    return