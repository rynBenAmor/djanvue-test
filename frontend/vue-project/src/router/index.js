import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/LoginForm.vue'
import HomeView from '@/views/HomeView.vue'
import BlogView from '@/views/BlogListView.vue'
import BlogPostView from '@/views/BlogPostView.vue'

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
  },
  {
    path: '/blog',
    name: 'blog',
    component: BlogView,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/blog/posts/:post_slug/:',
    name: 'blog-post',
    component: BlogPostView,
    meta: {
      requiresAuth: false,
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
