from django.shortcuts import render
from django.http import JsonResponse, HttpResponseRedirect
from django.conf import settings

from siteconfig.globals import GOOGLE_MAPS_PLACES, STRIPE_PUBLIC_KEY
from rest_framework.decorators import api_view


def landing(request):
  if request.user.is_authenticated:
    return HttpResponseRedirect('/dashboard')
  context = {
    'js_file': settings.JAVASCRIPT_URLS['landing']
  }
  return render(request, 'landing.html', context)

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

@api_view(['GET'])
def google_maps_key(request):
  return JsonResponse(GOOGLE_MAPS_PLACES, safe=False)