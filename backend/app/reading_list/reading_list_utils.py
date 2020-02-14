from django.core.cache import cache
import json
import requests
from utils.s3_utils import put_object, check_file, get_id
from reading_list.models import ReadingListItem, Article
from bs4 import BeautifulSoup
from datetime import datetime
import logging
import os
from django.http import JsonResponse
from reading_list.serializers import ReadingListItemSerializer
from django.core.cache import cache
from django.conf import settings
from django.core.validators import URLValidator
from django.core.exceptions import ValidationError
import threading


def get_reading_list(user):
    my_reading = None
    # if all:
    my_reading = ReadingListItem.objects.filter(reader=user, archived=False).order_by('-date_added')
    # else:
    #     my_reading = ReadingListItem.objects.filter(reader=user, archived=False).order_by('-date_added')[:10]
    serializer = ReadingListItemSerializer(my_reading, many=True)
    json_response = serializer.data
    return JsonResponse(json_response, safe=False)


def add_to_reading_list(user, link, date_added=None):
    validate = URLValidator()
    try:
        validate(link)
    except ValidationError:
        return JsonResponse(data={'error': 'Invalid URL.'}, status=400)
    article_json = get_parsed(link)
    title = article_json.get('title')

    soup = BeautifulSoup(article_json.get('content', None), 'html.parser')
    article_text = soup.getText()
    article_json['parsed_text'] = article_text

    article, created = Article.objects.get_or_create(
        title=title, permalink=link, mercury_response=article_json
    )

    if date_added is not None:
        reading_list_item, created = ReadingListItem.objects.get_or_create(
            reader=user, article=article, date_added=date_added
        )
    else:
        reading_list_item, created = ReadingListItem.objects.get_or_create(
            reader=user, article=article
        )

    try:
        upload_article = threading.Thread(target=html_to_s3, args=(link, user, article, article_json, ))
        upload_article.start()
    except:
        logging.warning("Threading failed")
    return

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
    article_id = get_id(url)
    if check_file('{}.html'.format(article_id), 'pulppdfs'):
        logging.warning("{} already uploaded, exiting".format(article_id))
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
    f = open("./{}.html".format(article_id), "w+")
    f.write(str(template_soup))
    f.close()

    metadata = {
        'url': url
    }
    put_object('pulppdfs', "{}.html".format(article_id), "./{}.html".format(article_id), metadata)
    os.remove("./{}.html".format(article_id))
    page_count = get_page_count(article_id)
    article.page_count = page_count
    article.save()
    ReadingListItem.objects.get_or_create(
        reader=user, article=article
    )
    # Purge Reading List Cache
    key = 'reading_list' + user.email
    cache.delete(key)
    return


def get_page_count(article_id):
    data = {'html_id': article_id}
    formatter_url = 'http://{}:5000/html_to_pdf'.format(settings.FORMATTER_HOST)
    response = requests.post(formatter_url, data=data)
    response_string = response.content.decode("utf-8")
    json_response = json.loads(response_string)
    pages = json_response.get('pages')
    html_id = json_response.get('html_id')
    if html_id != article_id:
        return None
    return pages
