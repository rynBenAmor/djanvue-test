import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useMessageStore } from '@/stores/messages'
// Importing views
import Login from '../views/LoginView.vue'
import HomeView from '@/views/HomeView.vue'
import BlogView from '@/views/BlogListView.vue'
import BlogPostView from '@/views/BlogPostView.vue'
import ChatRoomView from '@/views/ChatRoomView.vue'


const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      requiresAuth: true, // Assuming home requires authentication
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
  {
    path: '/chat-room',
    name: 'chat-room',
    component: ChatRoomView,
    meta:{
      requiresAuth: false, //for now
    }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})


// Global auth guard
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const messageStore = useMessageStore()

  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    messageStore.setMessage('You must be logged in to view this page.', 'warning')
    next('/login')
  } else {
    next()
  }
})

export default router
