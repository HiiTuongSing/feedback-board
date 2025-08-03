import { createRouter, createWebHistory } from 'vue-router'
import FeedbackBoard from '@/views/FeedbackBoard.vue'

const routes = [{ path: '/', name: 'FeedbackBoard', component: FeedbackBoard }]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
