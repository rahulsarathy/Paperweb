from django.shortcuts import render
from django.http import JsonResponse, HttpResponse

from rest_framework.decorators import api_view
from rest_framework import viewsets
from rest_framework.response import Response


from blogs import serializers
from blogs.models import Subscription, Blog

from blogs.all_blogs import BLOGS, blog_map

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

    category_json = {}
    for blog in BLOGS:
        new_blog = blog()
        categories = new_blog.categories

        if categories:
            for category in categories:
                if category not in category_json:
                    category_json[category] = [new_blog.to_json()]
                else:
                    category_json[category].append(new_blog.to_json())
    user = request.user
    try:
        subscriptions = Subscription.objects.get(subscriber=user)
    except:
        subscriptions = []

    return JsonResponse(category_json, safe=False)

@api_view(['POST'])
def get_subscription(request):
    user = request.user
    name_id = request.POST['name_id']
    print("name_id is {}".format(name_id))
    blog = Blog.objects.get(name=name_id)
    try:
        curr_subscription = Subscription.objects.get(subscriber=user, blog=blog)
    except Subscription.DoesNotExist:
        return JsonResponse(False, safe=False)
    except Subscription.MultipleObjectsReturned:
        return HttpResponse(status=500)

    # Already subscribed
    return JsonResponse(True, safe=False)


@api_view(['POST'])
def subscribe(request):
    user = request.user
    name_id = request.POST['name_id']
    blog = Blog.objects.get(name=name_id)
    print(name_id)
    new_subscription = Subscription(subscriber=user, blog=blog)
    new_subscription.save()
    return HttpResponse(status=200)

@api_view(['POST'])
def unsubscribe(request):
    user = request.user
    name_id = request.POST['name_id']
    blog = Blog.objects.get(name=name_id)
    try:
        old_subscription = Subscription.objects.get(subscriber=user, blog=blog)
    except Subscription.DoesNotExist:
        return HttpResponse(status=403)
    except Subscription.MultipleObjectsReturned:
        return HttpResponse(status=500)

    old_subscription.delete()
    return HttpResponse(status=200)

