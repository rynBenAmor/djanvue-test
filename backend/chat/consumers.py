from channels.generic.websocket import AsyncWebsocketConsumer
import json
import uuid
from datetime import datetime
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
        A short, random 8-character unique identifier for the user (generated with UUID per session connect), 
        sent from server to client on connect, after that the client sends to server it on every payload

    - self.username
        Display name derived from user_id (e.g., "User#abcd1234")

    - 'type' in message_dict
        indicates which method on the consumer is triggered to make a case statement in client side interface
        Example: type='chat_message' will call chat_message(self, event)
    
    - 'messageColor' :
        generated/sent (and saved to sessionStorage) from client side to the server and serves like user id


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
                'sent_at': datetime.now().strftime("%H:%M"),
                'is_system': True, #flag that this is a system message

                'message': f"{self.username} has joined the chat",
                
            }
        )

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
        
        # Notify others that a user left
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'system_message',
                'sent_at': datetime.now().strftime("%H:%M"),
                'is_system': True,

                'message': f"{self.username} has left the chat",
                
            }
        )

    async def receive(self, text_data):
        data = json.loads(text_data)

        if 'image_url' in data:
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'image_message',
                    'sent_at': datetime.now().strftime("%H:%M"),

                    'image_url': data['image_url'],
                    'messageColor': data['messageColor'],                    
                    'sender_id': self.user_id,
                    'sender_name': self.username,
                }
                )
            
        elif 'message' in data:
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'sent_at': datetime.now().strftime("%H:%M"),

                    'message': data['message'],
                    'messageColor': data['messageColor'],                    
                    'sender_id': self.user_id,
                    'sender_name': self.username,

                }
            )

            
    async def system_message(self, event):
        await self.send(text_data=json.dumps({
            'type': 'system_message',
            'sent_at': datetime.now().strftime("%H:%M"),
            'is_system': True,

            'message': event['message'],
        }))

    
    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'type': 'chat_message',
            'sent_at': datetime.now().strftime("%H:%M"),

            'message': event['message'],
            'messageColor': event['messageColor'],            
            'sender_id': event['sender_id'],
            'sender_name': event['sender_name'],

        }))

    
    async def image_message(self, event):
        await self.send(text_data=json.dumps({
            'type': 'image_message',
            'sent_at': datetime.now().strftime("%H:%M"),

            'image_url': event['image_url'],
            'messageColor': event['messageColor'],
            'sender_id': event['sender_id'],
            'sender_name': event['sender_name'],
        }))