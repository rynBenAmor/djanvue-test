<template>

  <nav-bar/>
<div class="btn btn-primary btn-lg" @click="shareLinkSocialMedia('facebook', 'http://localhost:5173/', 'hello world')">share on facebook</div>
  <message-alert/>

  <div class="container mt-4">
    <!-- Show routed views  -->
    <router-view />
    
  </div>

</template>

<script>

import NavBar from './components/NavBar.vue';
import MessageAlert from './components/MessageAlert.vue';
import { shareLinkSocialMedia } from './utils/utils';
export default {
  name: 'App',
  components: { NavBar, MessageAlert},
  methods:{
    shareLinkSocialMedia,
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