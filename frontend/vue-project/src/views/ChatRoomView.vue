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

                    <div class="card-body chat-messages" ref="messagesContainer">
                        <div v-for="(message, index) in messages" :key="index" class="message-wrapper">
                            <!-- System messages -->
                            <div v-if="message.is_system" class="system-message text-center mb-3">
                                <span class="badge bg-secondary">{{ message.message }}</span>
                            </div>

                            <!-- User messages -->
                            <div v-else class="d-flex mb-3"
                                :class="{ 'justify-content-end': isCurrentUser(message.sender_id) }">
                                <div class="message-bubble"
                                    :class="{ 'user-message': isCurrentUser(message.sender_id), 'other-message': !isCurrentUser(message.sender_id) }">
                                    <div v-if="!isCurrentUser(message.sender_id)"
                                        class="message-sender small text-muted">
                                        {{ message.sender_name }}
                                    </div>
                                    <div class="message-content">
                                        {{ message.message }}
                                    </div>
                                    <div v-if="message.localId" class="message-status">
                                        <i v-if="pendingMessages[message.localId] === 'sending'"
                                            class="fas fa-spinner fa-spin"></i>
                                        <i v-else-if="pendingMessages[message.localId] === 'delivered'"
                                            class="fas fa-check text-muted"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card-footer">
                        <form @submit.prevent="sendMessage" class="d-flex">
                            <input v-model="newMessage" type="text" class="form-control me-2"
                                placeholder="Type your message..." :disabled="!isConnected"
                                @keyup.enter="sendMessage" />
                            <button type="submit" class="btn btn-primary" :disabled="!newMessage || !isConnected">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
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
            pendingMessages: {}, // Track messages that are being sent
            localIdCounter: 0
        }
    },
    created() {
        // Generate a random username (matches your backend logic)
        this.userId = this.generateShortId();
        this.username = `User#${this.userId}`;

        this.connectWebSocket();
    },
    beforeUnmount() {
        this.disconnectWebSocket();
    },
    methods: {
        generateShortId() {
            // Generate a random 8-character ID similar to your Python code
            return Math.random().toString(36).substring(2, 10);
        },
        connectWebSocket() {
            // Adjust the WebSocket URL according to your Django setup
            //const wsScheme = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
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

                if (data.is_system) {
                    // System message (user joined/left)
                    this.messages.push({
                        message: data.message,
                        is_system: true
                    });
                } else {
                    // Regular chat message
                    const message = {
                        message: data.message,
                        sender_id: data.sender_id,
                        sender_name: data.sender_name,
                        is_user: data.is_user,
                        localId: data.localId
                    };

                    // If this is our own message (identified by localId), update its status
                    if (data.localId && this.pendingMessages[data.localId]) {
                        this.pendingMessages[data.localId] = 'delivered';
                    }

                    this.messages.push(message);
                }

                // Scroll to bottom of messages
                this.$nextTick(() => {
                    const container = this.$refs.messagesContainer;
                    container.scrollTop = container.scrollHeight;
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

            const localId = `msg-${Date.now()}-${this.localIdCounter++}`;
            const message = {
                message: this.newMessage,
                localId: localId
            };

            // Add to pending messages (shows loading spinner)
            this.pendingMessages[localId] = 'sending';

            // Add to messages immediately (optimistic UI)
            this.messages.push({
                message: this.newMessage,
                sender_id: this.userId,
                sender_name: this.username,
                is_user: true,
                localId: localId
            });

            // Clear input
            this.newMessage = '';

            // Scroll to bottom
            this.$nextTick(() => {
                const container = this.$refs.messagesContainer;
                container.scrollTop = container.scrollHeight;

                // Send the message
                this.socket.send(JSON.stringify(message));
            });
        },
        isCurrentUser(senderId) {
            return senderId === this.userId;
        }
    }
}
</script>

<style scoped>
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
    background-color: #e9ecef;
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