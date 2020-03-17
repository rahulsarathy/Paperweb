import os
import logging

from pulp.globals import HTML_BUCKET
from reading_list.models import Article, ReadingListItem
from reading_list.utils import add_to_reading_list, handle_pages, \
    html_to_s3, get_parsed, get_staged_articles, inject_json_into_html
from utils.s3_utils import check_file, get_article_id, download_link, get_magazine_id, put_object
from django.contrib.auth.models import User

from celery import task
from bs4 import BeautifulSoup


@task(name='handle_pages')
def handle_pages_task(link, email=None):
    try:
        article = Article.objects.get(permalink=link)
    except Article.DoesNotExist:
        logging.warning('Article {} does not exist'.format(link))
        return

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        # triggered from backfill_pages command
        return handle_pages(article)

    handle_pages(article, user)
    return


@task(name='start_create_magazine')
def start_create_magazine():
    users = User.objects.all()
    for user in users:
        create_user_magazine.delay(user.email)
    return

@task(name='create_user_magazine')
def create_user_magazine(email):
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        logging.warning('User {} does not exist'.format(email))
        return

    staged = get_staged_articles(user)

    assembly_soup = BeautifulSoup(open('./pdf/assembly.html'), 'html.parser')
    assembly_body = assembly_soup.find('body')
    magazine_id = get_magazine_id(staged[0].permalink)

    for item in staged:
        permalink = item.permalink
        article_id = get_article_id(permalink)

        # get article and check if uploaded
        article, article_created = Article.objects.get_or_create(
            permalink=permalink
        )
        if not check_file('{}.html'.format(article_id), HTML_BUCKET):
            html_to_s3(article)

        # populate template soup w/ content
        injected_soup = inject_json_into_html(article)
        injected_container = injected_soup.select_one('.container')
        injected_container['id'] = article_id

        # Add populated template soup to assembly soup
        assembly_body.append(injected_container)

    f = open("./{}.html".format(magazine_id), "w+")
    f.write(str(assembly_soup))
    f.close()
    put_object('pulpmagazines', "{}.html".format(magazine_id), "./{}.html".format(magazine_id))
    os.remove("./{}.html".format(magazine_id))

    return

