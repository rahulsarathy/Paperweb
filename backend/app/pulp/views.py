import json

from django.shortcuts import render
from django.http import JsonResponse, HttpResponseRedirect, HttpResponseNotFound
from django.conf import settings
from django.core.cache.backends.base import DEFAULT_TIMEOUT
from django.views.decorators.cache import cache_page
from django.core.exceptions import ValidationError

from pulp.globals import STRIPE_PUBLIC_KEY
from rest_framework.decorators import api_view
from reading_list.utils import get_parsed
import requests
import os

CACHE_TTL = getattr(settings, 'CACHE_TTL', DEFAULT_TIMEOUT)

def create_js_static_url(name):
    return settings.FRONTEND_HOST + name + '.js'

def error_404(request, exception=None):
    return render(request, '404.html', status=404)

def landing(request):
    if request.user.is_authenticated:
        return HttpResponseRedirect('/reading_list')
    context = {
        'js_file': create_js_static_url('landing')
    }
    return render(request, 'landing.html', context)

def testing(request):
    context = {
        "webpack_file": create_js_static_url("testing")
    }

    return render(request, 'testing.html', context)

def redirect_to_landing(request):
    if request.user.is_authenticated:
        return HttpResponseRedirect('/reading_list')
    return HttpResponseRedirect('/landing')

def switcher(request):
    if not request.user.is_authenticated:
        return HttpResponseRedirect('../')
    context = {
        'js_file': create_js_static_url('switcher'),
        'stripe_public_key': STRIPE_PUBLIC_KEY,
        'debug': settings.DEBUG
    }
    return render(request, 'reading_list.html', context)

def article(request):
    if not request.user.is_authenticated:
        return HttpResponseRedirect('../')
    url = request.GET.get('url')
    try:
        article_response = get_parsed(url)
    except ValidationError:
        return HttpResponseNotFound
    except requests.exceptions.RequestException:
        return HttpResponseNotFound

    json_response = json.dumps(article_response)
    context = {
        'article_response': json_response,
        'js_file': create_js_static_url('article')

    }
    return render(request, 'article.html', context)