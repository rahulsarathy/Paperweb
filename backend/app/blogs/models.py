from django.db import models
from django.contrib.auth.models import User


# Create your models here.

class Blog(models.Model):
	blog_id = models.CharField(max_length=200)
	blog_description = models.TextField()
	custom_scrape = models.BooleanField(default=False)
	rss_url = models.URLField()
	last_polled = models.DateTimeField(default=None, null=True)
	home_url = models.URLField()


class Subscription(models.Model):
	subscriber = models.ForeignKey(User, on_delete=models.CASCADE)
	blog = models.ForeignKey(Blog, on_delete=models.CASCADE)


	class Meta:
		unique_together = (("subscriber", "blog"),)

class Author(models.Model):
	first_name = models.CharField(max_length=200)
	last_name = models.CharField(max_length=200)
	description = models.TextField(default=None, null=True)
	blog = models.ForeignKey(Blog, on_delete=models.CASCADE)

	class Meta:
		unique_together = (("first_name", "last_name"),)

class Category(models.Model):
	category = models.CharField(max_length=150)

class BlogCategory(models.Model):
	blog = models.ForeignKey(Blog, on_delete=models.CASCADE)
	category = models.ForeignKey(Category, on_delete=models.CASCADE)



