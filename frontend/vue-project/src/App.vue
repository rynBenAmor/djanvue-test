<template>
    <nav-bar></nav-bar>

  <div class="container mt-4">


    <!-- Show login form only if not logged in 
    <login-form class="d-none" v-if="!username" @login-success="handleLoginSuccess" />-->


    <!-- Show routed views  -->
    <router-view />

  </div>
</template>

<script>

import NavBar from './components/NavBar.vue';

import axios from 'axios'
import { BACKEND_URL } from './config';


export default {
  components: {  NavBar, },
  data() {
    return {
      username: null,
    }
  },

  methods: {
    handleLoginSuccess(payload) {
      this.username = payload.username;
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + payload.accessToken;
    },


  },

  async mounted() {
    const token = localStorage.getItem('access_token')
    if (token) {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
      try {
        const res = await axios.get(BACKEND_URL + '/user/me/')
        this.username = res.data.username
      } catch {
        localStorage.removeItem('access_token')
        delete axios.defaults.headers.common['Authorization']
      }
    }
  },

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