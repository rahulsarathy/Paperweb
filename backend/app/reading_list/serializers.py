from reading_list.models import Article, ReadingListItem, InstapaperCredentials, PocketCredentials
import json
from rest_framework import serializers
from users.serializers import UserSerializer


class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = ['title', 'permalink', 'page_count', 'mercury_response']

    mercury_response = serializers.SerializerMethodField()

    def get_mercury_response(self, obj):
        return obj.mercury_response


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