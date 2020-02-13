from getpass import getpass
from bs4 import BeautifulSoup
import csv
import mechanicalsoup
from reading_list.reading_list_utils import add_to_reading_list, get_reading_list
from django.http import HttpResponse
from reading_list.tasks import parse_instapaper_csv, send_notification
import os

def import_from_instapaper(user, username, password):

    # use credentials to sign into instapaper
    # browser = mechanicalsoup.StatefulBrowser()
    # browser.open('https://www.instapaper.com/')
    # browser.follow_link('user/login')
    # browser.select_form('form[action="/user/login"]')
    # browser['username'] = username
    # browser['password'] = password
    # response = browser.submit_selected()
    #
    # # check if successfully signed in. If not, return error to user
    # response_soup = BeautifulSoup(response.text, 'html.parser')
    # response_error = response_soup.find_all('div', _class="flash_error")
    # if len(response_error) is 0:
    #     return HttpResponse("Invalid username or password", status=401)
    #
    # # Parse Instapaper data dump into a list
    # browser.follow_link('user')
    # browser.select_form('form[action="/export/csv"]')
    # response = browser.submit_selected()
    # csv_data = response.text
    with open(os.path.join('reading_list', 'instapaper.csv'), newline='') as f:
        reader = csv.reader(f)
        final_list = list(reader)
    # send_notification.delay()
    parse_instapaper_csv.delay(final_list, user.email)
    # result = csv.reader(csv_data.splitlines())
    # final_list = list(result)
    #
    # # Add all unread items to a user's reading list
    # links = []
    # for item in final_list:
    #     if item[3] == 'Unread':
    #         add_to_reading_list(user, item[0])
    return HttpResponse(status=200)