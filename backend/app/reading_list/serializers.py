from reading_list.models import Article, ReadingListItem
import json
from rest_framework import serializers


class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = ['title', 'permalink', 'word_count', 'mercury_response']

    mercury_response = serializers.SerializerMethodField()

    def get_mercury_response(self, obj):
        return obj.mercury_response


class ReadingListItemSerializer(serializers.ModelSerializer):
    article = ArticleSerializer()

    class Meta:
        model = ReadingListItem
        fields = ['article', 'date_added', 'archived', 'delivered', 'trashed', 'to_deliver']