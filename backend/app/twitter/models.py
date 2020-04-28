from django.db import models
from django.contrib.auth.models import User
from encrypted_model_fields.fields import EncryptedCharField

from reading_list.models import Article
# Create your models here.

class TwitterCredentials(models.Model):
	owner = models.OneToOneField(User, on_delete=models.CASCADE)
	token = EncryptedCharField(max_length=35)
	secret = EncryptedCharField(max_length=35)
	since_id = models.CharField(max_length=30, default=None, null=True)

class Tweet(models.Model):
	twitter_id = models.CharField(max_length=64, primary_key=True)
	text = models.CharField(max_length=500)
	reply_to = models.CharField(max_length=64, default=None, null=True)
	quote = models.CharField(max_length=64, default=None, null=True)

class TweetLink(models.Model):
	tweet_parent = models.ForeignKey(Tweet, on_delete=models.CASCADE, db_column='tweet_parent')
	url = models.URLField(primary_key=True)
	tco_url = models.URLField(default=None, null=True)
	article = models.ForeignKey(Article, on_delete=models.CASCADE,
								db_column='tweetlink_article', default=None, null=True)