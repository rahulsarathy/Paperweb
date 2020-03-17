
from django.shortcuts import render
from rest_framework.decorators import api_view
from django.http import JsonResponse, HttpResponse, HttpResponseRedirect
from pulp.globals import POCKET_CONSUMER_KEY, INSTAPAPER_CONSUMER_ID, INSTAPAPER_CONSUMER_SECRET


# Create your views here.

@api_view(['POSt'])
def sync_instapaper(request):
    pass


@api_view(['POST'])
def authenticate_instapaper(request):
    user = request.user
    if not user.is_authenticated:
        return JsonResponse(data={'error': 'Invalid request.'}, status=403)

    username = request.POST['username']
    password = request.POST['password']

    user = request.user
    authenticate_url = 'https://www.instapaper.com/api/1/oauth/access_token'
    oauth = OAuth1(client_key=INSTAPAPER_CONSUMER_ID, client_secret=INSTAPAPER_CONSUMER_SECRET)
    data = {
        'x_auth_username': username,
        'x_auth_password': password,
        'x_auth_mode': 'client_auth',
    }

    response = requests.post(authenticate_url, data=data, auth=oauth)
    text = response.text
    parsed = urllib.parse.parse_qs(text)
    oauth_token_secret = parsed['oauth_token_secret'][0]
    oauth_token = parsed['oauth_token'][0]

    try:
        credentials = InstapaperCredentials.objects.get(owner=user)
    except InstapaperCredentials.DoesNotExist:
        credentials = InstapaperCredentials(owner=user)

    credentials.oauth_token = oauth_token
    credentials.oauth_token_secret = oauth_token_secret
    credentials.save()

    parse_instapaper_bookmarks.delay(user.email)

    return HttpResponse(status=200)