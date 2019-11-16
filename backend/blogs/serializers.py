from blogs.models import Article, ReadingListItem
import json
from rest_framework import serializers


class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = ['title', 'permalink', 'word_count']


class ReadingListItemSerializer(serializers.ModelSerializer):
    article = ArticleSerializer()

    class Meta:
        model = ReadingListItem
        fields = ['article', 'date_added', 'archived', 'delivered', 'trashed']