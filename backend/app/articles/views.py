import json

from reading_list.models import Article
from reading_list.utils import get_parsed, add_article
from pulp.views import create_js_static_url
from utils.s3_utils import get_article_id as get_id

from django.shortcuts import render
from rest_framework.decorators import api_view
from django.http import JsonResponse, HttpResponse, HttpResponseRedirect
from django.contrib.auth.decorators import login_required

# Create your views here.

def error_404(request, exception=None):
    return render(request, '404.html', status=404)

def article_landing(request):

	context = {
		'js_file': create_js_static_url('article_landing')
	}

	return render(request, 'article_landing.html', context)

def article(request, article_id):

	context = {
		'js_file': create_js_static_url('article'),
		'article_id': article_id
	}

	return render(request, 'article.html', context)

@api_view(['GET'])
def get_article_id(request):
	url = request.GET['url']
	add_article(url)
	article_id = get_id(url)
	return HttpResponse(article_id)

@api_view(['GET'])
def get_article(request):
	article_id = request.GET['article_id']
	try:
		requested_article = Article.objects.get(custom_id=article_id)
	except Article.DoesNotExist:
		return HttpResponse(status=403)

	article_response = get_parsed(requested_article.permalink)

	json_response = json.dumps(article_response)

	return JsonResponse(article_response, safe=False)