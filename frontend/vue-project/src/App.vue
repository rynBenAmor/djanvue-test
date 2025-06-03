<template>

  <nav-bar/>

  <message-alert/>

  <div class="container mt-4">
    <!-- Show routed views  -->
    <router-view />
    
  </div>

</template>

<script>

import NavBar from './components/NavBar.vue';
import MessageAlert from './components/MessageAlert.vue';

export default {
  name: 'App',
  components: { NavBar, MessageAlert},

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