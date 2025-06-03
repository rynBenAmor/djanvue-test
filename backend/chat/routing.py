# chat/routing.py
from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/chat/$', consumers.ChatConsumer.as_asgi()),
]
# This file defines the routing for WebSocket connections in the chat application.
# It maps the WebSocket URL to the ChatConsumer class, which handles the WebSocket connections.