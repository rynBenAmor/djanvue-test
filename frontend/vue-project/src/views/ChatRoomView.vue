<template>
  <div class="chat-room-view">
    <h1>Chat Room</h1>
    <div class="chat-box">
      <div v-for="(msg, index) in messages" :key="index" class="chat-message">
        {{ msg }}
      </div>
    </div>
    <input
      v-model="newMessage"
      @keyup.enter="sendMessage"
      placeholder="Type your message"
      class="form-control mt-2"
    />
    <button @click="sendMessage" class="btn btn-primary mt-2">Send</button>
  </div>
</template>




<script>

export default {
    data() {
        return {
            socket: null,
            messages: [],
            newMessage: ''
        }
    },
    mounted() {
        this.socket = new WebSocket(`ws:127.0.0.1:8000/ws/chat/`);
        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.messages.push(data.message);
        };
    },
    methods: {
        sendMessage() {
            if (this.newMessage.trim() !== '') {
                // Send the new message to the WebSocket server
                this.socket.send(JSON.stringify({ message: this.newMessage }));
                this.newMessage = '';
            }
        }
    },
    beforeUnmount() {
        if (this.socket) {
            this.socket.close();
        }
    }
}
</script>