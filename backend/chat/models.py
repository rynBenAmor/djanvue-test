# chat/models.py
from django.db import models


class ChatMessage(models.Model):
    user = models.ForeignKey('quickstart.User', on_delete=models.CASCADE)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}: {self.message[:30]}"



""""
# chat/consumers.py
#run this :
# daphne tutorial.asgi:application
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
import json

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_group_name = 'chat_room'
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']
        user = self.scope['user']
        
        if not isinstance(user, AnonymousUser):
            await self.save_message(user, message)
        
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'username': user.username if not isinstance(user, AnonymousUser) else 'Anonymous'
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'username': event['username']
        }))
    
@database_sync_to_async
def save_message(self, user, message):
    try:
        from django.apps import apps
        ChatMessage = apps.get_model('chat', 'ChatMessage')
        ChatMessage.objects.create(user=user, message=message)
    except Exception as e:
        import logging
        logging.error(f"Error saving message: {e}")

"""