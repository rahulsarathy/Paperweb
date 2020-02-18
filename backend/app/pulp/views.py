from django.shortcuts import render
from django.http import JsonResponse, HttpResponseRedirect
from django.conf import settings
from django.core.cache.backends.base import DEFAULT_TIMEOUT
from django.views.decorators.cache import cache_page

from pulp.globals import GOOGLE_MAPS_PLACES, STRIPE_PUBLIC_KEY
from rest_framework.decorators import api_view
from reading_list.reading_list_utils import get_parsed
import json

CACHE_TTL = getattr(settings, 'CACHE_TTL', DEFAULT_TIMEOUT)


def error_404(request, exception=None):
    return render(request, '404.html', status=404)


def landing(request):
  if request.user.is_authenticated:
    return HttpResponseRedirect('/reading_list')
  context = {
    'js_file': settings.JAVASCRIPT_URLS['landing']
  }
  return render(request, 'landing.html', context)


def newsletters(request):
  if not request.user.is_authenticated:
    return HttpResponseRedirect('/')
  context = {
    'js_file': settings.JAVASCRIPT_URLS['newsletters']
  }
  return render(request, 'newsletters.html', context)


@cache_page(CACHE_TTL)
def dashboard(request):
  if not request.user.is_authenticated:
    return HttpResponseRedirect('../')
  context = {
    'js_file': settings.JAVASCRIPT_URLS['dashboard']
  }
  return render(request, 'dashboard.html', context)


def profile(request):
  if not request.user.is_authenticated:
    return HttpResponseRedirect('../')
  context = {
    'js_file': settings.JAVASCRIPT_URLS['profile']
  }
  return render(request, 'profile.html', context)


def delivery(request):
  if not request.user.is_authenticated:
    return HttpResponseRedirect('../')
  context = {
    'js_file': settings.JAVASCRIPT_URLS['delivery']
  }
  return render(request, 'delivery.html', context)


def switcher(request):
  if not request.user.is_authenticated:
    return HttpResponseRedirect('../')
  pocket = request.GET.get('pocket', 'null')
  context = {
    'js_file': settings.JAVASCRIPT_URLS['switcher'],
    'pocket': pocket,
  }
  return render(request, 'reading_list.html', context)


def reading_list(request):
  if not request.user.is_authenticated:
    return HttpResponseRedirect('../')
  context = {
    'js_file': settings.JAVASCRIPT_URLS['switcher']
  }
  return render(request, 'reading_list.html', context)


def article(request):
  if not request.user.is_authenticated:
    return HttpResponseRedirect('../')
  url = request.GET.get('url')
  article_response = get_parsed(url)
  json_response = json.dumps(article_response)
  context = {
    'article_response': json_response,
    'js_file': settings.JAVASCRIPT_URLS['article']

  }
  return render(request, 'article.html', context)


def subscribe(request):
  if not request.user.is_authenticated:
    return HttpResponseRedirect('../')
  context = {
    'js_file': settings.JAVASCRIPT_URLS['subscribe'],
    'stripe_public_key': STRIPE_PUBLIC_KEY,
  }
  return render(request, 'subscribe.html', context)


@api_view(['GET'])
def google_maps_key(request):
  return JsonResponse(GOOGLE_MAPS_PLACES, safe=False)
