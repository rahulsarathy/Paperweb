
from blogs.models import Blog, Author
from reading_list.models import Article
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

    class Meta:
        model = Blog
        fields = ['name']

    def create(self, validated_data):
        return Blog(**validated_data)

    def update(self, instance, validated_data):
        for field, value in validated_data.items():
            setattr(instance, field, value)
        return instance

class AuthorSerializer(serializers.ModelSerializer):

    class Meta:
        model = Author
        fields = ['first_name', 'last_name', 'description']

class BlogSerializer(serializers.ModelSerializer):

    class Meta:
        model = Article
        fields = ['blog_id', 'blog_description', 'home_url', 'authors', 'categories']

    authors = serializers.SerializerMethodField()
    categories = serializers.SerializerMethodField()


    def get_categories(self, obj):


        return obj.mercury_response.get('lead_image_url')

    def get_authors(self, obj):
        authors = Author.objects.get(blog=self)
        serializer = AuthorSerializer(authors, many=True)
        return serializer.data