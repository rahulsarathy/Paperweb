import os
import csv

from reading_list.models import InstapaperCredentials
from reading_list import tasks
from reading_list.utils import add_to_reading_list, get_reading_list

from bs4 import BeautifulSoup
import mechanicalsoup
from django.http import HttpResponse
from django.utils import timezone
import requests

def import_from_instapaper(user, username, password):
    # use credentials to sign into instapaper
    browser = mechanicalsoup.StatefulBrowser()
    browser.open('https://www.instapaper.com/')
    browser.follow_link('user/login')
    browser.select_form('form[action="/user/login"]')
    browser['username'] = username
    browser['password'] = password
    response = browser.submit_selected()

    # check if successfully signed in. If not, return error to user
    response_soup = BeautifulSoup(response.text, 'html.parser')
    response_error = response_soup.select('.flash_error')
    if len(response_error) > 0:
        return HttpResponse("Invalid username or password", status=401)

    # Parse Instapaper data dump into a list
    browser.follow_link('user')
    browser.select_form('form[action="/export/csv"]')
    response = browser.submit_selected()
    csv_data = response.text
    result = csv.reader(csv_data.splitlines())

    final_list = list(result)
    InstapaperCredentials.objects.get_or_create(
        username=username,
        password=password,
        owner=user,
        last_polled=timezone.now()
    )
    tasks.parse_instapaper_csv.delay(final_list, user.email)

    return HttpResponse(status=200)

def instapaper_api(username, password):
    authenticate_url = 'https://www.instapaper.com//api/1/oauth/access_token'

    data = {
        'x_auth_username': username,
        'x_auth_password': password,
        'x_auth_mode': 'client_auth',
    }
    response = requests.get(authenticate_url, data=data)
    print(response)
    return response