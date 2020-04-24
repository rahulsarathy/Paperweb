import logging
import json
import re

from django.shortcuts import render
from rest_framework.decorators import api_view
from django.http import JsonResponse, HttpResponseRedirect, HttpResponse
from pulp.globals import TWITTER_API_KEY as TWITTER_CONSUMER_KEY, TWITTER_SECRET as TWITTER_CONSUMER_SECRET
from django.core.cache import cache
from twitter.models import TwitterCredentials
from reading_list.utils import add_article
from reading_list.models import Article
from reading_list.serializers import ArticleSerializer

from requests_oauthlib import OAuth1
import requests
import urllib
import vcr
from django.core.exceptions import ValidationError


url_pattern = '(?:(?:https?|ftp):\/\/)?[\w/\-?=%.]+\.[\w/\-?=%.]+'

# Create your views here.

@api_view(['POST'])
def start_authentication(request):
	api_url = 'https://api.twitter.com/oauth/request_token'

	user = request.user
	if not user.is_authenticated:
		return JsonResponse(data={'error': 'Invalid request.'}, status=403)

	hostname = request.get_host()
	oauth_callback = 'http://{}/api/twitter/authenticate/'.format(hostname)
	data = {'oauth_callback': oauth_callback}

	oauth = OAuth1(client_key=TWITTER_CONSUMER_KEY, client_secret=TWITTER_CONSUMER_SECRET)

	response = requests.post(api_url, data=data, auth=oauth)
	text = response.text
	parsed = urllib.parse.parse_qs(text)
	# parsed = response.text
	print(parsed)
	oauth_token_secret = parsed['oauth_token_secret'][0]
	oauth_token = parsed['oauth_token'][0]

	# 'true' or 'false'
	oauth_callback_confirmed = parsed['oauth_callback_confirmed'][0]
	if oauth_callback_confirmed != 'true':
		print(oauth_callback_confirmed)
		logging.warning('oauth callback not confirmed')
		return HttpResponse(status=403)

	result = {
		'secret': oauth_token_secret,
		'oauth_token': oauth_token,
	}

	key = request.user.email + 'twitter'
	cache.set(key, result)

	return JsonResponse(result)

@api_view(['GET'])
def get_timeline_request(request):
	user = request.user
	if not user.is_authenticated:
		return JsonResponse(data={'error': 'Invalid request.'}, status=403)
	try:
		credentials = TwitterCredentials.objects.get(owner=user)
	except TwitterCredentials.DoesNotExist:
		return HttpResponse(status=403)

	result = get_timeline(credentials)

	return JsonResponse(result, safe=False)

def get_timeline(credentials):
	response_json = get_timeline_json(credentials)
	return response_json
	urls = get_links(response_json)
	result = []
	for url in urls:
		try:
			article = Article.objects.get(url=url)
			serializer = ArticleSerializer(article)
			article_json = serializer.data
			result.append(article_json)
		except Article.DoesNotExist:
			pass
	return result

@vcr.use_cassette('twitter/timeline.yaml')
def get_timeline_json(credentials):
	api_url = 'https://api.twitter.com/1.1/statuses/home_timeline.json'
	access_token = credentials.token
	secret = credentials.secret

	oauth = OAuth1(client_key=TWITTER_CONSUMER_KEY, client_secret=TWITTER_CONSUMER_SECRET,
				   resource_owner_key=access_token, resource_owner_secret=secret)

	data = {
		'count': 200,
		'since_id': credentials.since_id
	}
	response = requests.get(api_url, auth=oauth, params=data)

	response_json = json.loads(response.text)
	return response_json

def get_tweet_json(id, access_token, secret):

	api_url = 'https://api.twitter.com/1.1/statuses/show.json'

	data = {
		'id': id
	}

	oauth = OAuth1(client_key=TWITTER_CONSUMER_KEY, client_secret=TWITTER_CONSUMER_SECRET,
				   resource_owner_key=access_token, resource_owner_secret=secret)

	response = requests.get(api_url, auth=oauth, params=data)
	text = response.text
	response_json = json.loads(text)
	return response_json


def find_link(tweet):

	# is retweet
	if tweet.get('retweeted_status'):
		pass

	# if tweet is not reply
	if tweet['in_reply_to_status_id'] is None:
		# find links and if t.co redirect them
		tweet_text = tweet['text']
		matches = re.findall(url_pattern, tweet_text)
		for match in matches:
			if re.match('https:\/\/t.co\/.*', match):
				# handle redirect
				r = requests.get(match)
				match = r.url



	# if tweet is reply
		# find links in original and t.co redirect
		# find links in parent and t.co redirect

	# if tweet is quote tweet
	if tweet['is_quote_status']:
		# find links in original
		# find links in quote tweet
		pass
	pass

def get_links(timeline):
	urls = []
	for tweet in timeline:

		tweet_text = tweet['text']
		matches = re.findall(url_pattern, tweet_text)
		for match in matches:
			try:
				if re.match('https:\/\/t.co\/.*', match):
					# handle redirect
					r = requests.get(match)
					match = r.url
				add_article(match)
				urls.append(match)
			except ValidationError:
				continue
	return urls



@api_view(['GET'])
def authenticate(request):
	user = request.user
	if not user.is_authenticated:
		return JsonResponse(data={'error': 'Invalid request.'}, status=403)
	oauth_verifier = request.GET['oauth_verifier']
	oauth_token = request.GET['oauth_token']

	key = user.email + 'twitter'
	code = cache.get(key)
	ro_key = code.get('oauth_token')
	ro_secret = code.get('secret')
	
	
	if oauth_token != ro_key:
		logging.warning('mismatched oauth keys. cache key is {} and received is {}'.format(ro_key, oauth_token))
		return HttpResponse(status=403)

	api_url = 'https://api.twitter.com/oauth/access_token'

	data = {'oauth_verifier': oauth_verifier, 'oauth_token': oauth_token, 'oauth_consumer_key': TWITTER_CONSUMER_KEY}

	# oauth = OAuth1(client_key=TWITTER_CONSUMER_KEY,
	# 							resource_owner_key=ro_key,
	# 							resource_owner_secret=ro_secret)

	# response = requests.post(api_url, data=data, auth=oauth)
	response = requests.post(api_url, data=data)
	text = response.text

	parsed = urllib.parse.parse_qs(text)
	# parsed = response.text
	oauth_token_secret = parsed['oauth_token_secret'][0]
	oauth_token = parsed['oauth_token'][0]

	TwitterCredentials(owner=user, token=oauth_token, secret=oauth_token_secret).save()

	return HttpResponseRedirect('/twitter')
