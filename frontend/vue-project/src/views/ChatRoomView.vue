<template>
    <div class="container-fluid chat-room-container">
        <div class="row">
            <div class="col-12">
                <h1 class="text-center my-4">
                    <i class="fas fa-comments me-2"></i>Chat Room
                </h1>
            </div>
        </div>

        <div class="row justify-content-center">
            <div class="col-md-8 col-lg-6">
                <div class="card chat-card">
                    <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                        <span><i class="fas fa-user me-2"></i>{{ username }}</span>
                        <span class="badge bg-light text-primary">{{ connectionStatus }}</span>
                    </div>

                    <div class="card-body chat-messages bg-secondary-subtle" ref="messagesContainer">
                        <div v-for="(message, index) in messages" :key="index" class="message-wrapper">
                            <!-- System messages -->
                            <div v-if="message.is_system" class="system-message text-center mb-3">
                                <span class="badge bg-secondary">
                                    {{ message.message }} - <small class="small text-muted">{{ message.sent_at
                                        }}</small>
                                </span>

                            </div>

                            <!-- User messages -->
                            <div v-else class="d-flex mb-3"
                                :class="{ 'justify-content-end': isCurrentUser(message.sender_id) }">
                                <div class="message-bubble"
                                    :class="{ 'user-message': isCurrentUser(message.sender_id), 'other-message': !isCurrentUser(message.sender_id) }"
                                    :style="{ '--randomBg': message.messageColor }">
                                    <div v-if="!isCurrentUser(message.sender_id)"
                                        class="message-sender small text-muted">
                                        {{ message.sender_name }}
                                    </div>
                                    <div class="message-content d-flex flex-column">
                                        <template v-if="message.image_url">
                                            <img :src="'http://127.0.0.1:8000' + message.image_url" alt="chat image"
                                                style="max-width: 200px; max-height: 200px; cursor: pointer;"
                                                @click="openImageModal('http://127.0.0.1:8000' + message.image_url)" />
                                        </template>
                                        <template v-else>
                                            {{ message.message }}
                                        </template>

                                        <small class="small text-muted ms-auto mt-1">{{ message.sent_at }}</small>

                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div class="card-footer">

                        <form @submit.prevent="sendMessage" class="d-flex align-items-center">
                            <input ref="chatInputRef" v-model="newMessage" type="text" class="form-control me-2"
                                placeholder="Type your message..." :disabled="!isConnected"
                                @keyup.enter="sendMessage" />

                            <label for="imageInput" class="btn btn-outline-secondary me-2 mb-0"
                                style="padding: 0.375rem 0.75rem;">
                                <i class="fas fa-image"></i>
                            </label>
                            <input id="imageInput" type="file" ref="imageInput" @change="handleImageUpload"
                                accept="image/*" style="display: none;" />

                            <button type="submit" class="btn btn-primary" :disabled="!newMessage || !isConnected">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </form>

                    </div>
                </div>
            </div>
        </div>

        <!-- simple modal for viewing the images -->
        <div class="modal fade" id="imageModal" ref="imageModal">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content bg-transparent border-0">
                    <div class="modal-body p-0 text-center">
                        <img :src="modalImageSrc" alt="Expanded" class="img-fluid rounded shadow"
                            style="max-height: 80vh;">
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>


<script>
import { BACKEND_URL } from '@/config';
import axios from 'axios';
import { Modal } from 'bootstrap/dist/js/bootstrap.bundle.min';



export default {
    name: 'ChatRoomView',
    data() {
        return {
            newMessage: '',
            messages: [],
            socket: null,
            isConnected: false,
            connectionStatus: 'Disconnected',
            username: '',
            userId: '',

            randomBgColor: '#e9ecef',
            modalImageSrc: '',

        }
    },

    mounted() {

        this.connectWebSocket(); //connect and attach event handlers (listeners)

        this.$refs.chatInputRef.focus();

        // this will later be passed as data 'messageColor' to bind a user to a color
        const stored = sessionStorage.getItem('randomBgColor');
        if (stored) {
            this.randomBgColor = stored;
        } else {
            const palette = [
                '#f8bbd0', // Rose Pink
                '#ffe082', // Soft Amber
                '#b2ebf2', // Aqua Blue
                '#dcedc8', // Pale Lime
                '#ffccbc', // Melon
                '#e1bee7', // Soft Lavender
                '#b3e5fc', // Sky Blue
                '#d1c4e9', // Periwinkle
                '#ffecb3', // Pale Gold
                '#c8e6c9', // Light Mint
                '#ffcc80', // Apricot
                '#f8bbd0', // Pink Blush
                '#80deea', // Cyan Tint
                '#ffab91', // Coral Blush
                '#a5d6a7', // Mint Green
                '#ffd54f', // Vivid Mustard
                '#ce93d8', // Lavender Purple
                '#81d4fa', // Bright Sky
                '#ffe082', // Sunbeam
                '#4dd0e1', // Fresh Cyan
                '#ffb74d', // Light Tangerine
                '#aed581', // Soft Avocado
                '#ba68c8', // Medium Lavender
                '#64b5f6', // Light Denim
                '#fff176', // Yellow Tint
                '#9575cd', // Soft Violet
                '#4fc3f7', // Sky Tint
                '#f06292', // Watermelon
                '#aed581', // Light Olive
                '#fff59d'  // Buttery Yellow
            ];


            const color = palette[Math.floor(Math.random() * palette.length)];
            sessionStorage.setItem('randomBgColor', color);
            this.randomBgColor = color;
        }

    },

    beforeUnmount() {
        this.disconnectWebSocket();
    },
    methods: {

        connectWebSocket() {

            const wsUrl = 'ws://127.0.0.1:8000/ws/chat/';

            this.socket = new WebSocket(wsUrl);
            this.connectionStatus = 'Connecting...';

            this.socket.onopen = () => {
                this.isConnected = true;
                this.connectionStatus = 'Connected';
                console.log('WebSocket connected');
            };

            this.socket.onclose = (e) => {
                this.isConnected = false;
                this.connectionStatus = 'Disconnected';
                console.log('WebSocket disconnected', e);

                // Try to reconnect after 5 seconds
                setTimeout(() => {
                    this.connectWebSocket();
                }, 5000);
            };

            this.socket.onerror = (error) => {
                console.error('WebSocket error:', error);
                this.connectionStatus = 'Error';
            };

            this.socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                console.log('WebSocket message received:', data);
                // Handle different message types

                // Handle user info message (sent only to the request user on start)
                if (data.type === 'user_info') {
                    // User info payload
                    this.userId = data.user_id;
                    this.username = data.username;
                    return;
                }

                else if (data.type === 'system_message') {
                    // System message
                    this.messages.push({
                        message: data.message,
                        sent_at: data.sent_at,
                        is_system: true
                    });

                } else if (data.type === 'chat_message') {
                    // chat message
                    this.messages.push({
                        message: data.message,
                        messageColor: data.messageColor,
                        sent_at: data.sent_at,
                        sender_id: data.sender_id,
                        sender_name: data.sender_name,

                    });
                } else if (data.type == 'image_message') {
                    this.messages.push({
                        image_url: data.image_url,
                        messageColor: data.messageColor,
                        sent_at: data.sent_at,
                        sender_id: data.sender_id,
                        sender_name: data.sender_name,
                    })
                }


                // scroll to the bottom of the messages container after a delay
                this.$nextTick(() => {
                    setTimeout(() => {
                        const container = this.$refs.messagesContainer;
                        if (container) {
                            container.scrollTop = container.scrollHeight;
                        } else {
                            console.warn('messagesContainer is null');
                        }
                    }, 0); // even 0ms is enough to yield to the render cycle
                });

            };
        },

        disconnectWebSocket() {
            if (this.socket) {
                this.socket.close();
            }
        },

        sendMessage() {
            if (!this.newMessage.trim() || !this.isConnected) return;

            // Send the message to the backend
            this.socket.send(JSON.stringify({
                type: 'chat_message',
                message: this.newMessage,
                messageColor: this.randomBgColor, //initiate the user color
                sender_id: this.userId,
                sender_name: this.username
            }));

            this.newMessage = '';
            this.$refs.chatInputRef.focus();
        },

        // send image through http and wait fir response to send the image url to the websocket
        async handleImageUpload(event) {
            const file = event.target.files[0];
            if (!file || !this.isConnected) return;

            const formData = new FormData();
            formData.append('image', file);

            try {
                const response = await axios.post(`${BACKEND_URL}/chat/upload-image/`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                const data = response.data;

                if ([200, 201].includes(response.status) && data.url) {
                    // Send image URL via WebSocket
                    this.socket.send(JSON.stringify({
                        image_url: data.url,
                        messageColor: this.randomBgColor,
                    }));
                } else {
                    alert('Image upload failed: http response failure.');
                }
            } catch (err) {
                alert('Image upload error.');
                console.error(err)
            } finally {
                // Clear the file input
                this.$refs.imageInput.value = '';
            }
        },

        isCurrentUser(senderId) {
            return senderId === this.userId;
        },
        openImageModal(src) {
            this.modalImageSrc = src;

            const modalElement = this.$refs.imageModal;
            if (!modalElement) {
                console.error('Modal element not found');
                return;
            }

            const modal = new Modal(modalElement, {
                backdrop: true,
                keyboard: true,
                focus: true,
            });

            modal.show();

        },

    }
}
</script>


<style scoped>
/*
📡 WebSocket Lifecycle Guide (Browser)

1. new WebSocket(url)
   - Opens a connection to the server (ws:// or wss://)

2. socket.onopen
   - Triggered when the connection is established
   - Good place to send an initial message or log connection

3. socket.onmessage
   - Triggered whenever the server sends data
   - Not tied to a specific send(); use message type/ID if tracking is needed

4. socket.onerror
   - Triggered on network/protocol error (not message-level errors)

5. socket.onclose
   - Triggered when connection is closed (by server or client)
   - Use to cleanup or trigger reconnection logic

Usage:
  socket.send(JSON.stringify({ message: "Hello" }))  // Send data to server
  // The server can send messages at any time → triggers onmessage
*/

.chat-room-container {
    height: 100vh;
    padding-top: 20px;
    background-color: #f8f9fa;
}

.chat-card {
    height: 80vh;
    display: flex;
    flex-direction: column;
}

.chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 15px;
    background-color: #f8f9fa;
}

.message-bubble {
    max-width: 70%;
    padding: 10px 15px;
    border-radius: 18px;
    position: relative;
    word-wrap: break-word;
}

.user-message {
    background-color: #007bff;
    color: white;
    border-bottom-right-radius: 0;
}

.other-message {
    background-color: var(--randomBg, #e9ecef);
    color: #212529;
    border-bottom-left-radius: 0;
}

.system-message {
    margin: 10px 0;
}

.message-sender {
    margin-bottom: 4px;
    font-weight: bold;
}

.message-status {
    position: absolute;
    right: 5px;
    bottom: 5px;
    font-size: 0.7em;
}

/* Custom scrollbar for chat messages */
.chat-messages::-webkit-scrollbar {
    width: 8px;
}

.chat-messages::-webkit-scrollbar-track {
    background: #f1f1f1;
}

.chat-messages::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
}
</style>
