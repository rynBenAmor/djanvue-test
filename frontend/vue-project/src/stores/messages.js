// src/stores/messages.js
import { defineStore } from 'pinia'

export const useMessageStore = defineStore('message', {
  state: () => ({
    text: '',
    type: '', // e.g. 'success', 'error', 'info'
  }),
  actions: {
    setMessage(text, type = 'info') {
      this.text = text
      this.type = type
    },
    clearMessage() {
      this.text = ''
      this.type = ''
    }
  },
  getters: {
    getMessage: (state) => state.text,
    getMessageType: (state) => state.type,
  },
})
