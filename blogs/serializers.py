from blogs.models import Blog, Article
import json


from rest_framework import serializers

class BlogSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=256)
    about = serializers.CharField(max_length=256)
    about_link = serializers.CharField(max_length=256)
    authors = serializers.ListField(
        child=serializers.JSONField()
    )
    recent_posts = serializers.ListField(
        child=serializers.JSONField()
    )
    image = serializers.CharField(max_length=256)
    categories = serializers.ListField(
        child=serializers.CharField(max_length=256)
    )

    def create(self, validated_data):
        return Blog(**validated_data)

    def update(self, instance, validated_data):
        for field, value in validated_data.items():
            setattr(instance, field, value)
        return instance


class ArticleSerializer(serializers.ModelSerializer):
    title = serializers.CharField(max_length=100)
    permalink = serializers.URLField()
    date_published = serializers.DateTimeField()
    author = serializers.CharField()
    file_link = serializers.URLField()

    class Meta:
        model = Article
        fields = ['title', 'permalink', 'date_published', 'author', 'file_link']

    def create(self, validated_data):
        return Article(**validated_data)

    def update(self, instance, validated_data):
        for field, value in validated_data.items():
            setattr(instance, field, value)
        return instance
