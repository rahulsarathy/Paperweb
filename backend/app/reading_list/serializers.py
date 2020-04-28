from reading_list.models import Article, ReadingListItem
import json
from rest_framework import serializers


class ArticleSerializer(serializers.ModelSerializer):

    class Meta:
        model = Article
        fields = ['title', 'permalink', 'page_count', 'preview_text', 'image_url', 'author', 'custom_id']

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