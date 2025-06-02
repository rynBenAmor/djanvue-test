<template>

  <nav-bar></nav-bar>
  <div v-if="getMessageText" :class="'alert alert-' + getMessageType" class="text-center mt-3">
    {{ getMessageText }}
  </div>
  <div class="container mt-4">
    <!-- Show routed views  -->
    <router-view />
  </div>

</template>

<script>

import NavBar from './components/NavBar.vue';
import { useMessageStore } from './stores/messages';

export default {
  name: 'App',
  components: { NavBar, },
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
    }
  },
  watch: {
    $route() {
      this.messageStore.clearMessage()
    }
  }
}
</script>


<style>
.router-link-exact-active {
  font-weight: bold;
  color: #42b983;
}

.router-link-active {
  font-weight: bold;
  color: #42b983;
}
</style>