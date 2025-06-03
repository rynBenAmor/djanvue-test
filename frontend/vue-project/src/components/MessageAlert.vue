<template>
    <div v-if="getMessageText" :class="'alert alert-dismissible alert-' + getMessageType" class="text-center mt-3">
    <p>{{ getMessageText }}</p>
        
        <button @click="clearMessage" type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
</template>



<script>

import { useMessageStore } from '@/stores/messages';

export default {
  name: 'MessageAlert',

  data() {
    return {
      messageStore: useMessageStore(),
    }
  },
    computed: {

    getMessageText() {
      return this.messageStore.getMessage || '';  // fallback
    },
    getMessageType() {
      return this.messageStore.getMessageType || 'info';
    },
    clearMessage(){
        return this.messageStore.clearMessage;
    }
  },
  watch: {
    $route() {
      this.messageStore.clearMessage()
    }
  }
}
</script>
