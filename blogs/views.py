from django.http import JsonResponse, HttpResponse

from rest_framework.decorators import api_view
from rest_framework import viewsets
from rest_framework.response import Response

from blogs import serializers
from blogs.models import Subscription, Blog, Article
from utils.blog_utils import BLOGS, blog_map
import traceback

CATEGORIES = ["Rationality", "Economics", "Technology"]

LANDING_BLOGS = ['bryan_caplan_econlib', 'stratechery', 'melting_asphalt', 'mercatus_center', 'ribbonfarm',
                 'marginal_revolution', 'slatestarcodex', 'kwokchain']

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

    return JsonResponse(category_json, safe=False)

@api_view(['GET'])
def get_posts(request):
    user = request.user
    subscriptions = Subscription.objects.filter(subscriber=user)
    posts = []
    for subscription in subscriptions:
        sub_blog = subscription.blog
        blog_posts = Article.objects.filter(blog=sub_blog)
        posts.extend(blog_posts)
    posts.sort(key=lambda x: x.date_published, reverse=True)
    serialized_posts = []
    for post in posts:
        current_blog = blog_map(post.blog.name)
        blog_name = current_blog().display_name

        article_json = {
            'title': post.title,
            'permalink': post.permalink,
            'date_published': post.date_published,
            'author': post.author,
            'blog_name': blog_name,
        }
        serialized_posts.append(article_json)

    return JsonResponse(serialized_posts, safe=False)

# Blogs to display for the landing page
@api_view(['GET'])
def get_landing_blogs(request):
    landing_blogs = []
    for blog in BLOGS:
        new_blog = blog()
        if new_blog.name_id in LANDING_BLOGS:
            landing_blogs.append(new_blog.to_json())
    return JsonResponse(landing_blogs, safe=False)

@api_view(['POST'])
def check_sub_status(request):
    user = request.user
    name_id = request.POST['name_id']
    try:
        blog = Blog.objects.get(name=name_id)
    except:
        return JsonResponse(False, safe=False)

    try:
        curr_subscription = Subscription.objects.get(subscriber=user, blog=blog)
    except Subscription.DoesNotExist:
        return JsonResponse(False, safe=False)
    except Subscription.MultipleObjectsReturned:
        return HttpResponse(status=500)

    # Already subscribed
    return JsonResponse(True, safe=False)

@api_view(['GET'])
def get_subscriptions(request):
    current_user = request.user
    print("user is ", current_user)
    try:
        subscriptions = Subscription.objects.filter(subscriber=current_user)
        print(subscriptions)
    except Exception as e:
        print(str(e))
        return JsonResponse({})

    blogs = []
    for subscription in subscriptions:
        subscribed_blog = subscription.blog
        blog_object = blog_map(subscribed_blog.name)
        blogs.append(blog_object().to_json())

    return JsonResponse(blogs, safe=False)

@api_view(['POST'])
def subscribe(request):
    user = request.user
    name_id = request.POST['name_id']

    try:
        subscriptions = Subscription.objects.filter(subscriber=user)
    except Exception as e:
        print(str(e))
        return HttpResponse(status=400)

    if len(subscriptions) == 8:
        return HttpResponse(status=400)

    try:
        blog = Blog.objects.get(name=name_id)
    except:
        traceback.print_exc()
        return HttpResponse(status=500)
    try:
        new_subscription = Subscription(subscriber=user, blog=blog)
        new_subscription.save()
    except:
        return HttpResponse(status=403)

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

