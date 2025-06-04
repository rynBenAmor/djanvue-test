import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createHead } from '@vueuse/head'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import App from './App.vue'
import router from './router'

//Note : export default : no {} for imports
//       export {} : must use {} for imports

const app = createApp(App)
const pinia = createPinia()
const head = createHead() // an seo plugin

pinia.use(piniaPluginPersistedstate) // This plugin allows Pinia stores to persist their state across page reloads using session
app.use(pinia)
app.use(router)
app.use(head)

app.mount('#app')
