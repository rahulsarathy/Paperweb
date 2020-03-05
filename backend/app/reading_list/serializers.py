from reading_list.models import Article, ReadingListItem, InstapaperCredentials, PocketCredentials
import json
from rest_framework import serializers
from users.serializers import UserSerializer


class ArticleSerializer(serializers.ModelSerializer):

    class Meta:
        model = Article
        fields = ['title', 'permalink', 'page_count', 'preview_text', 'image_url', 'author']

    image_url = serializers.SerializerMethodField()
    author = serializers.SerializerMethodField()


    def get_image_url(self, obj):
        return obj.mercury_response.get('lead_image_url')

    def get_author(self, obj):
        return obj.mercury_response.get('author')


class ReadingListItemSerializer(serializers.ModelSerializer):
    article = ArticleSerializer()

    class Meta:
        model = ReadingListItem
        fields = ['article', 'date_added', 'archived', 'delivered', 'trashed', 'to_deliver']


class InstapaperCredentialsSerializer(serializers.ModelSerializer):
    owner = UserSerializer()

    class Meta:
        model = InstapaperCredentials
        fields = ['owner', 'last_polled']


class PocketCredentialsSerializer(serializers.ModelSerializer):
    owner = UserSerializer()

    class Meta:
        model = PocketCredentials
        fields = ['owner', 'last_polled']