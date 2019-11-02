from django.shortcuts import render
from django.http import JsonResponse, HttpResponseRedirect
from django.conf import settings
from django.core.cache.backends.base import DEFAULT_TIMEOUT
from django.views.decorators.cache import cache_page

from pulp.globals import GOOGLE_MAPS_PLACES, STRIPE_PUBLIC_KEY
from rest_framework.decorators import api_view

CACHE_TTL = getattr(settings, 'CACHE_TTL', DEFAULT_TIMEOUT)

def error_404(request, exception=None):
    return render(request, '404.html', status=404)

def landing(request):
  if request.user.is_authenticated:
    return HttpResponseRedirect('/dashboard')
  context = {
    'js_file': settings.JAVASCRIPT_URLS['landing']
  }
  return render(request, 'landing.html', context)

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
    'stripe_public_key': STRIPE_PUBLIC_KEY,
    'js_file': settings.JAVASCRIPT_URLS['profile']

  }
  return render(request, 'profile.html', context)

def feed(request):
  if not request.user.is_authenticated:
    return HttpResponseRedirect('../')
  context = {
    'js_file': settings.JAVASCRIPT_URLS['feed']
  }
  return render(request, 'feed.html', context)

def reading_list(request):
  if not request.user.is_authenticated:
    return HttpResponseRedirect('../')
  context = {
    'js_file': settings.JAVASCRIPT_URLS['reading_list']
  }
  return render(request, 'reading_list.html', context)


@api_view(['GET'])
def google_maps_key(request):
  return JsonResponse(GOOGLE_MAPS_PLACES, safe=False)
