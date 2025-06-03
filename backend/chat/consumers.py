from channels.generic.websocket import AsyncWebsocketConsumer
import json
import uuid
"""
🔧 Django Channels - WebSocket Consumer Guide

📦 Built-ins (from AsyncWebsocketConsumer):
    - AsyncWebsocketConsumer
        Handles WebSocket lifecycle: connect(), receive(), disconnect()
    
    - self.send(text_data)
        Sends a message directly to the connected WebSocket client (1-to-1)
    
    - self.channel_layer
        Interface to the pub/sub system (e.g., Redis) for group messaging

    - self.channel_name
        Unique ID for the current WebSocket connection (used to target individual sockets)

    - await self.channel_layer.group_add(group_name, channel_name)
        Adds this connection to a named group for broadcasting

    - await self.channel_layer.group_send(group_name, message_dict)
        Sends a message to all connections in the group

    - await self.channel_layer.send(channel_name, message_dict)
        Sends a message to a single specific connection using its channel_name


🧾 Custom variables (defined in my ChatConsumer):
    - self.room_group_name
        The name of the chat group all users connect to (e.g., 'chat_room')

    - self.user_id
        A short, random 8-character unique identifier for the user (generated with UUID)

    - self.username
        Display name derived from user_id (e.g., "User#abcd1234")

    - 'type' in message_dict
        Dictates which method on the consumer is triggered
        Example: type='chat_message' will call chat_message(self, event)


📚 Common Actions (Cheat Sheet):

    Action                          | Code Example
    --------------------------------|-------------------------------------------------------------
    Send to yourself                | await self.send(text_data=json.dumps({...}))
    Send to all in group            | await self.channel_layer.group_send(group, {'type': ..., ...})
    Send to specific connection     | await self.channel_layer.send(channel_name, {'type': ..., ...})
    Add to group                    | await self.channel_layer.group_add(group, self.channel_name)
    Remove from group               | await self.channel_layer.group_discard(group, self.channel_name)
"""


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

            }
        )


    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'sender_id': event['sender_id'],
            'sender_name': event['sender_name'],

        }))

            
    async def system_message(self, event):
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'is_system': True
        }))