<template>
  <transition name="toast-slide">
    <div v-if="getMessageText" :class="['toast-notification', `toast-${getMessageType}`]">
      <div class="toast-content">
        <i :class="typeIcon" class="toast-icon"></i>
        <p class="toast-message">{{ getMessageText }}</p>
      </div>
      <button @click="clearMessage" type="button" class="toast-close">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
  </transition>
</template>

<script>
import { useMessageStore } from '@/stores/messages';

export default {
  name: 'ToastNotification',

  data() {
    return {
      messageStore: useMessageStore(),
      timeoutId: null
    }
  },

  computed: {
    getMessageText() {
      return this.messageStore.getMessage || '';
    },

    getMessageType() {
      return this.messageStore.getMessageType || 'info';
    },

    typeIcon() {
      const icons = {
        success: 'fa-solid fa-circle-check',
        error: 'fa-solid fa-circle-exclamation',
        warning: 'fa-solid fa-triangle-exclamation',
        info: 'fa-solid fa-circle-info'
      };
      return icons[this.getMessageType] || icons.info;
    }
  },

  watch: {
    getMessageText(newVal) {
      if (newVal) {
        this.setAutoDismiss();
      }
    },

    $route() {
      this.messageStore.clearMessage();
      this.clearTimeout();
    }
  },

  methods: {
    clearMessage() {
      this.messageStore.clearMessage();
      this.clearTimeout();
    },

    setAutoDismiss() {
      this.clearTimeout();
      this.timeoutId = setTimeout(() => {
        this.clearMessage();
      }, 5000);
    },

    clearTimeout() {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }
    }
  },

  beforeUnmount() {
    this.clearTimeout();
  }
}
</script>

<style scoped>
.toast-notification {
  position: fixed;
  bottom: 20px;
  right: 20px;
  max-width: 350px;
  padding: 1rem 1.25rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  z-index: 1100;
  animation: toast-fade-in 0.3s ease-out;
  color: white;
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.toast-icon {
  font-size: 1.25rem;
}

.toast-message {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.4;
}

.toast-close {
  background: transparent;
  border: none;
  color: inherit;
  opacity: 0.75;
  cursor: pointer;
  padding: 0.25rem;
  align-self: flex-start;
  transition: opacity 0.2s;
}

.toast-close:hover {
  opacity: 1;
}

.toast-success {
  background-color: #28a745;
}

.toast-error {
  background-color: #dc3545;
}

.toast-warning {
  background-color: #fd7e14;
}

.toast-info {
  background-color: #17a2b8;
}

.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: all 0.3s ease;
}

.toast-slide-enter-from,
.toast-slide-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

@keyframes toast-fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>