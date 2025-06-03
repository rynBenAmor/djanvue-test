import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import App from './App.vue'
import router from './router'



const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate) // This plugin allows Pinia stores to persist their state across page reloads using session

app.use(pinia)
app.use(router)

app.mount('#app')
