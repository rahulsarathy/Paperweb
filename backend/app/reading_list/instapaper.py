from getpass import getpass
from bs4 import BeautifulSoup
import csv
import mechanicalsoup
from reading_list.utils import add_to_reading_list, get_reading_list
from django.http import HttpResponse
from reading_list import tasks
import os
from reading_list.models import InstapaperCredentials
from django.utils import timezone

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
