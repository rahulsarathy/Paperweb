from django.shortcuts import render
from django.http import JsonResponse

from siteconfig.globals import GOOGLE_MAPS_PLACES
from rest_framework.decorators import api_view


def index(request):
  return render(request, 'index.html')

def dashboard(request):
  return render(request, 'dashboard.html')

def profile(request):
  return render(request, 'profile.html')

@api_view(['GET'])
def google_maps_key(request):
  return JsonResponse(GOOGLE_MAPS_PLACES, safe=False)