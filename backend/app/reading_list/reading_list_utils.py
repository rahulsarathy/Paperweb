from django.core.cache import cache
import json
import requests
from utils.s3_utils import put_object, check_file, get_id
from reading_list.models import ReadingListItem, Article
from bs4 import BeautifulSoup
from datetime import datetime
from pulp.globals import HTML_BUCKET
import logging
import os
from django.http import JsonResponse
from reading_list.serializers import ReadingListItemSerializer
from django.core.cache import cache
from django.conf import settings
from django.core.validators import URLValidator
from django.core.exceptions import ValidationError
import threading
import celery


def get_reading_list(user):
    my_reading = None
    # if all:
    my_reading = ReadingListItem.objects.filter(reader=user, archived=False).order_by('-date_added')
    # else:
    #     my_reading = ReadingListItem.objects.filter(reader=user, archived=False).order_by('-date_added')[:10]
    serializer = ReadingListItemSerializer(my_reading, many=True)
    json_response = serializer.data
    return JsonResponse(json_response, safe=False)


# 1. Validate URL
# 2. Get Parsed Article JSON
# 3. Add Article to DB
# 4. Convert article to PDF and count pages
# 5. Choose if Article should be set to deliver
def add_to_reading_list(user, link, date_added=None):

    # Validate url
    validate = URLValidator()
    try:
        validate(link)
    except ValidationError:
        return JsonResponse(data={'error': 'Invalid URL.'}, status=400)

    # get article json and populate DB fields
    article_json = get_parsed(link)
    title = article_json.get('title')
    soup = BeautifulSoup(article_json.get('content', None), 'html.parser')
    article_text = soup.getText()
    article_json['parsed_text'] = article_text
    article, article_created = Article.objects.get_or_create(
        title=title, permalink=link, mercury_response=article_json
    )

    # Some instapaper links come with a timestamp
    if date_added is not None:
        reading_list_item, created = ReadingListItem.objects.get_or_create(
            reader=user, article=article, date_added=date_added
        )
    else:
        reading_list_item, created = ReadingListItem.objects.get_or_create(
            reader=user, article=article
        )

    if article_created:
        from reading_list.tasks import handle_pages_task
        handle_pages_task.delay(user.email, link)

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
def html_to_s3(article):
    url = article.permalink
    article_id = get_id(url)
    json_response = get_parsed(url)

    # Extract variables from json source
    date_string = None
    content = json_response.get('content')
    author = json_response.get('author')
    date_published = json_response.get('date_published')
    title = json_response.get('title')
    domain = json_response.get('domain')

    # Format Date String
    try:
        if date_published is not None:
            date_object = datetime.strptime(date_published[:10], '%Y-%m-%d')
            date_string = date_object.strftime('Originally published on %B %-d, %Y')
    except:
        date_string = None

    # Populate html template with extracted variables
    template_soup = BeautifulSoup(open('./pdf/template.html'), 'html.parser')
    if title is not None:
        template_soup.select_one('.title').string = title
    if author is not None:
        template_soup.select_one('#author').string = 'By ' + author
    if date_string is not None:
        template_soup.select_one('#date').string = date_string
    template_soup.select_one('#domain').string = domain

    soup = BeautifulSoup(content, 'html.parser')

    # find one layer of links and remove them, but preserve inner content
    # for link in soup.findAll('a'):
    #     innerhtml = "".join([str(x) for x in link.contents])
    #     link.insert_after(BeautifulSoup(innerhtml, 'html.parser'))
    #     link.extract()

    template_soup.select_one('.main-content').insert(0, soup)
    f = open("./{}.html".format(article_id), "w+")
    f.write(str(template_soup))
    f.close()

    # upload object to S3 with permalink as metadata
    metadata = {
        'url': url
    }
    put_object(HTML_BUCKET, "{}.html".format(article_id), "./{}.html".format(article_id), metadata)
    os.remove("./{}.html".format(article_id))
    return


# 1. Upload to s3 if not already
# 2. Get page count of PDF via conversion
#
def handle_pages(user, article):
    url = article.permalink
    article_id = get_id(url)

    # If file is not uploaded, then uploaded
    if not check_file('{}.html'.format(article_id), HTML_BUCKET):
        html_to_s3(article)

    # Count pages of article
    page_count = get_page_count(article_id)
    article.page_count = page_count
    article.save()

    # Set to_deliver for ReadingListItem
    rlist_item, created = ReadingListItem.objects.get_or_create(
        reader=user, article=article
    )
    # Check if we should check this article to to_deliver
    to_deliver = False
    current_pages = get_selected_pages(user, url)
    total_pages = page_count + current_pages
    if total_pages > 50:
        to_deliver = False
    else:
        to_deliver = True
    rlist_item.to_deliver = to_deliver
    rlist_item.save()


def get_selected_pages(user, permalink):
    rlist_items = ReadingListItem.objects.filter(reader=user)
    total_pages = 0
    for item in rlist_items:
        if item.to_deliver:
            if item.article.page_count is None:
                item.to_deliver = False
                item.save()
            else:
                total_pages = total_pages + item.article.page_count

    article, created = Article.objects.get_or_create(
        permalink=permalink
    )

    reading_list_item, created = ReadingListItem.objects.get_or_create(
        reader=user, article=article
    )

    return total_pages


def get_page_count(article_id):
    data = {'html_id': article_id}
    puppeteer_url = 'http://{}:4000/api/print'.format(settings.PUPPETEER_HOST)
    try:
        response = requests.post(puppeteer_url, data=data)
    except requests.exceptions.ConnectionError:
        logging.warning("failed to connect to puppeteer for {}".format(article_id))
        return {"pages": 0}
    response_string = response.content.decode("utf-8")
    json_response = json.loads(response_string)
    pages = json_response.get('pages')
    html_id = json_response.get('html_id')
    if html_id != article_id:
        return None
    return pages
