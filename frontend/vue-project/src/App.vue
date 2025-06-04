<template>

  <nav-bar />

  <span class="btn btn-primary btn-sm position-fixed top-50 start-0 m-0"
    style="transform: rotate(90deg); opacity: 0.8 !important;"
    @click="shareLinkSocialMedia('facebook', 'http://localhost:5173/', 'hello world')">
    <i class="fa-brands fa-facebook"></i>
    share on facebook
  </span>

  <message-alert />

  <div class="container-fluid mt-4">
    <!-- Show routed views  -->
    <router-view />
  </div>

</template>

<script>

import NavBar from './components/NavBar.vue';
import MessageAlert from './components/MessageAlert.vue';
import { shareLinkSocialMedia } from './utils/utils';
import { useHead } from '@vueuse/head';


export default {
  name: 'App',
  components: { NavBar, MessageAlert },
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
/**
 * 1 - Axios rule of thumb (GET or with optional body for POST/PUT):
 * 
 * async function fetchData() {
 *   try {
 *     // For GET requests, just omit `data`
 *     // For POST/PUT, pass body as second argument (JS object, auto JSON stringified)
 *     const response = await axios.get('https://api.example.com/data', {
 *       headers: { Authorization: 'Bearer token' }
 *     });
 * 
 *     // Example POST with body:
 *     // const response = await axios.post('https://api.example.com/data', { name: 'John' }, {
 *     //   headers: { Authorization: 'Bearer token' }
 *     // });
 * 
 *     console.log('Success:', response.data);
 *   } catch (error) {
 *     console.error('Error:', error.response?.data || error.message);
 *   }
 * }
 * fetchData();
 *
 *
 * 2 - Fetch rule of thumb (GET or with optional body for POST/PUT):
 * 
 * async function fetchData() {
 *   try {
 *     const response = await fetch('https://api.example.com/data', {
 *       method: 'GET', // Change to POST, PUT etc when sending body
 *       headers: {
 *         Authorization: 'Bearer token',
 *         'Content-Type': 'application/json' // needed if sending JSON body
 *       },
 *       // For POST/PUT, include body as JSON string:
 *       // body: JSON.stringify({ name: 'John' })
 *     });
 * 
 *     if (!response.ok) throw new Error(`Error: ${response.status}`);
 * 
 *     const data = await response.json();
 *     console.log('Success:', data);
 *   } catch (error) {
 *     console.error('Error:', error.message);
 *   }
 * }
 * fetchData();
 */

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