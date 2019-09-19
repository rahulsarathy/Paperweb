from django.shortcuts import render
from django.http import JsonResponse

from siteconfig.globals import GOOGLE_MAPS_PLACES, STRIPE_PUBLIC_KEY
from rest_framework.decorators import api_view


def landing(request):
  return render(request, 'landing.html')

def dashboard(request):
  return render(request, 'dashboard.html')

def profile(request):
  context = {
    'stripe_public_key': STRIPE_PUBLIC_KEY
  }
  return render(request, 'profile.html', context)

@api_view(['GET'])
def google_maps_key(request):
  return JsonResponse(GOOGLE_MAPS_PLACES, safe=False)