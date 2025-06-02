<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link active" aria-current="page" to="/">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/blog">blog</router-link>
          </li>

          <li v-if="username" class="nav-item">
            <span class="nav-link disabled" aria-disabled="true">{{ username }}</span>
          </li>
          <li v-if="username" class="nav-item">
            <form @submit.prevent="logout">
              <button class="btn btn-outline-danger" type="submit">Logout</button>
            </form>
          </li>
          <li v-else class="nav-item">
            <router-link class="nav-link" to="/login">Login</router-link>
          </li>

        </ul>

      </div>
    </div>
  </nav>

  <div class="container mt-4">
    <h1 v-if="username" class="text-center text-success">Welcome, {{ username }}!</h1>
    <h1 v-else class="text-center text-info">Please Log In</h1>

    <!-- Show login form only if not logged in -->
    <login-form class="d-none" v-if="!username" @login-success="handleLoginSuccess" />


    <!-- Show routed views  -->
    <router-view />
  </div>
</template>

<script>
import LoginForm from './components/LoginForm.vue'

import axios from 'axios'
import { BACKEND_URL } from './config';


export default {
  components: { LoginForm },
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

    async logout() {
      try {
        await axios.post(BACKEND_URL + '/user/logout/')

      } catch (err) {
        console.error('Logout error:', err)
      } finally {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        delete axios.defaults.headers.common['Authorization']
        this.username = null
      }
    }
  },

  async mounted() {
    const token = localStorage.getItem('access_token')
    if (token) {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/user/me/')
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