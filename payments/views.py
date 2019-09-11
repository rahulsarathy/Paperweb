from django.shortcuts import render
from rest_framework.decorators import api_view
from utils.google_maps_utils import autocomplete
from django.http import JsonResponse

# Create your views here.
@api_view(['GET'])
def address_autocomplete(request):
    address = request.GET['address']
    autocompleted = autocomplete(address)

    return JsonResponse(autocompleted, safe=False)