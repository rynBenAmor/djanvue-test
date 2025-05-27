import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/LoginForm.vue'
import HomeView from '@/views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      requiresAuth: false,
    },
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
