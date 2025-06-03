from channels.generic.websocket import AsyncWebsocketConsumer
import json
import uuid

class ChatConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.user_id = str(uuid.uuid4())[:8]  # Generate a random 8-character ID
        self.username = f"User#{self.user_id}"


    async def connect(self):
        self.room_group_name = 'chat_room'
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

        # Send the user their ID immediately after connection
        await self.send(text_data=json.dumps({
            'type': 'user_info',
            'user_id': self.user_id,
            'username': self.username
        }))
        
        # Notify others that a user joined
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'system_message',
                'message': f"{self.username} has joined the chat",
                'is_system': True #flag that this is a system message
            }
        )

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
        
        # Notify others that a user left
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'system_message',
                'message': f"{self.username} has left the chat",
                'is_system': True
            }
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']
        
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'sender_id': self.user_id,
                'sender_name': self.username,
                'is_user': False  # False for others, but this needs adjustment
            }
        )


    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'sender_id': event['sender_id'],
            'sender_name': event['sender_name'],
            'is_user': event.get('is_user', False)  # Default to False
        }))

            
    async def system_message(self, event):
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'is_system': True
        }))