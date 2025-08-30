import { createRouter, createWebHistory } from 'vue-router'
import FeedbackBoard from '@/views/FeedbackBoard.vue'
import Auth from '@/views/Auth.vue'
import { useAuthStore } from '@/stores/auth'

const routes = [
  { path: '/', name: 'Auth', component: Auth, meta: { 'guestOnly': true} },
  { path: '/feedback_board', name: 'FeedbackBoard', component: FeedbackBoard, meta: { 'requiresAuth': true } }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  await authStore.authCheck()
  const isAuthenticated = authStore.isLoggedIn
  console.log(isAuthenticated)

  if(to.meta.requiresAuth && !isAuthenticated){
    return next({ name: 'Auth' })
  }

  if(to.meta.guestOnly && isAuthenticated){
    console.log('test', to.meta.guestOnly)
    return next({ name: 'FeedbackBoard' })
  }

  next()
})

export default router
