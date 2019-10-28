from django.http import JsonResponse, HttpResponse

from rest_framework.decorators import api_view
from rest_framework import viewsets
from rest_framework.response import Response

from blogs import serializers
from blogs.models import Subscription, Blog, Article, ReadingListItem
from utils.blog_utils import BLOGS, blog_map
from newspaper import Article
import traceback

CATEGORIES = ["Rationality", "Economics", "Technology", "Think Tanks"]


class BlogViewSet(viewsets.ViewSet):
    # Required for the Browsable API renderer to have a nice form.
    serializer_class = serializers.BlogSerializer

    def list(self, request):
        serializer = serializers.BlogSerializer(
            instance=BLOGS, many=True)
        return Response(serializer.data)

@api_view(['GET'])
def get_blogs(request):

    all_blogs = []
    for blog in BLOGS:
        new_blog = blog()
        all_blogs.append(new_blog.to_json())

    return JsonResponse(all_blogs, safe=False)

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
    # dates = map(lambda x: x.date_published.date(), posts)
    date_map = {

    }
    for post in posts:

        current_blog = blog_map(post.blog.name)
        blog_name = current_blog().display_name

        article_json = {
            'title': post.title,
            'permalink': post.permalink,
            'date_published': post.date_published.date(),
            'author': post.author,
            'blog_name': blog_name,
        }
        if str(post.date_published.date()) in date_map.keys():
            date_map[str(post.date_published.date())].append(article_json)
        else:
            date_map[str(post.date_published.date())] = [article_json]

    return JsonResponse(date_map)

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

    # if len(subscriptions) == 8:
    #     return HttpResponse(status=400)

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

# @api_view(['POST'])
# def add_to_reading_list(request):
#     user = request.user
#     link = request.POST['link']
#     try:
#         already_added = ReadingListItem.objects.get()
#     return

@api_view(['GET'])
def get_title(request):
    permalink = request.POST['permalink']
    article = Article(permalink)
    article.download()
    article.parse()
    title = article.title
    return JsonResponse(title, safe=False)


