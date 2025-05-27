<template>
  <div>
    <h1 v-if="username" class="text-center text-success">Welcome, {{ username }}!</h1>
    <h1 v-else class="text-center text-info">Please Log In</h1>

    <!-- Show login form only if not logged in -->
    <login-form v-if="!username" @login-success="handleLoginSuccess" />
    
    <!-- Show routed views only if logged in -->
    <router-view v-else />
  </div>
</template>

<script>
import LoginForm from './components/LoginForm.vue'
import axios from 'axios'

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
