# chat/consumers.py
import json
import hashlib

from progress.types import get_channel_id

from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncWebsocketConsumer
from django.http import JsonResponse

class ProgressConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']
        if not self.user.is_authenticated:
            return JsonResponse(data={'error': 'Invalid request.'}, status=403)

        # Join room group
        self.channel_id = get_channel_id(self.user.email)
        await self.channel_layer.group_add(
            self.channel_id,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.channel_id,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        # Send message to room group
        # await self.channel_layer.group_send(
        #     self.channel_id,
        #     text_data_json
        # )
        # await self.channel_layer.send('chat_message', {"message": "sending from backend"})

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'job_type': 'message',
        }))

    async def add_to_reading_list(self, event):
        link = event['link']
        percent = event['percent']

        await self.send(text_data=json.dumps({
            'job_type': 'add_to_reading_list',
            'link': link,
            'percent': percent
        }))

    async def page_count(self, event):
        page_count = event['page_count']
        link = event['link']
        await self.send(text_data=json.dumps({
            'job_type': 'page_count',
            'page_count': page_count,
            'link': link
        }))

    async def instapaper_queue(self, event):
        total = event['total']
        completed = event['completed']
        await self.send(text_data=json.dumps({
            'job_type': 'instapaper_queue',
            'total': total,
            'completed': completed
        }))

    async def to_deliver(self, event):
        to_deliver = event['to_deliver']
        link = event['link']
        await self.send(text_data=json.dumps({
            'job_type': 'to_deliver',
            'to_deliver': to_deliver,
            'link': link
        }))

    async def reading_list_item(self, event):
        reading_list_item = event['reading_list_item']
        await self.send(text_data=json.dumps({
            'job_type': 'reading_list_item',
            'reading_list_item': reading_list_item,
        }))


    async def pocket_queue(self, event):
        pass