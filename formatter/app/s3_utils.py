import boto3
import os

S3_USER_ACCESS_ID = os.environ.get('S3_USER_ACCESS_ID')
S3_USER_SECRET = os.environ.get('S3_USER_SECRET')

s3_client = boto3.client('s3', aws_access_key_id=S3_USER_ACCESS_ID, aws_secret_access_key=S3_USER_SECRET)


def download_link(bucket_name, s3_file_path, output_file_path):
    s3 = boto3.client('s3')
    s3.download_file(bucket_name, s3_file_path, output_file_path)