from django.shortcuts import render
from django.http import JsonResponse, HttpResponse

from rest_framework.decorators import api_view
from rest_framework import viewsets
from rest_framework.response import Response


from blogs import serializers
from blogs.models import Subscription

from blogs.all_blogs import BLOGS

CATEGORIES = ["Rationality", "Economics", "Technology"]


class BlogViewSet(viewsets.ViewSet):
    # Required for the Browsable API renderer to have a nice form.
    serializer_class = serializers.BlogSerializer

    def list(self, request):
        serializer = serializers.BlogSerializer(
            instance=BLOGS, many=True)
        return Response(serializer.data)

@api_view(['GET'])
def get_blogs(request):

    final_json = {}
    for blog in BLOGS:
        new_blog = blog()
        categories = new_blog.categories

        if categories:
            for category in categories:
                if category not in final_json:
                    final_json[category] = [new_blog.to_json()]
                else:
                    final_json[category].append(new_blog.to_json())
    return JsonResponse(final_json, safe=False)

@api_view(['POST'])
def subscribe(request):
    user = request.user
    print(request.POST)
    # name_id = request.name_id
    # print(name_id)
    # new_subscription = Subscription(subscriber=user, blog=)
    return HttpResponse('Welcome to the library')
