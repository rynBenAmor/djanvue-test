<template>

  <nav-bar />

  <span class="btn btn-primary btn-sm position-fixed top-50 start-0 m-0"
    style="transform: rotate(90deg); opacity: 0.8 !important;"
    @click="shareLinkSocialMedia('facebook', 'http://localhost:5173/', 'hello world')">
    <i class="fa-brands fa-facebook"></i>
    share on facebook
  </span>

  <toast-notification />

  <div class="container-fluid mt-4">
    <!-- Show routed views  -->
    <router-view />
  </div>

</template>

<script>

import NavBar from './components/NavBar.vue';
import ToastNotification from './components/ToastNotification.vue';
import { shareLinkSocialMedia } from './utils/utils';
import { useHead } from '@vueuse/head';


export default {
  name: 'App',
  components: { NavBar, ToastNotification },
  methods: {
    shareLinkSocialMedia,
  },
  mounted() {

    // default seo, can override in views
    useHead({
      title: 'default title',
      meta: [
        { name: 'description', content: 'this is a default meta description' },
        { name: 'keywords', content: 'about, team, mission' },
        { property: 'og:title', content: 'About Us | MyApp' },
        { name: 'robots', content: 'index,follow' }
      ]
    })
  },

}
</script>


<style>

html,
body,
#app {
  padding: 0;
  margin: 0;
}

.router-link-exact-active {
  font-weight: bold;
  color: #42b983;
}

.router-link-active {
  font-weight: bold;
  color: #42b983;
}
</style>