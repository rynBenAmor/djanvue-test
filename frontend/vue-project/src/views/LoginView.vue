<template>
  <div class="container mt-5" style="max-width: 400px;">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <div class="mb-3">
        <label for="username" class="form-label">Username</label>
        <input v-model="username" id="username" class="form-control" required />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input v-model="password" id="password" type="password" class="form-control" required />
      </div>
      <button type="submit" class="btn btn-primary w-100">Log In</button>
    </form>
    <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
  </div>
</template>

<script>
import axios from 'axios';
import { BACKEND_URL } from '@/config'; // Adjust the import path as necessary
import { useUserStore } from '@/stores/user';

export default {
  data() {
    return {
      username: '',
      password: '',
      error: null,
    };
  },
  methods: {
    async login() {
      this.error = null;
      try {
        const res = await axios.post(BACKEND_URL + '/token/', {
          username: this.username,
          password: this.password,
        });
        const accessToken = res.data.access;
        const refreshToken = res.data.refresh;

        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);

        axios.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;

        // Fetch current user info after login
        const userRes = await axios.get(BACKEND_URL + '/user/me/');
        const currentUsername = userRes.data.username;

        // Use Pinia store
        const userStore = useUserStore();
        userStore.setUser(currentUsername);

        // Emit event to parent with username
        this.$emit('login-success', { username: currentUsername, accessToken });

        // Optionally redirect or show a message
        // this.$router.push('/'); // Uncomment to redirect after login

      } catch (err) {
        this.error = 'Login failed: Invalid credentials.';
        console.error('Login error:', err);
      }
    },
  },
};
</script>