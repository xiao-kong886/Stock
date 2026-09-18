import { createRouter, createWebHashHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'
import { session } from '@/stores/session'

const routes = [
  { path: '/',            name: 'login',     component: LoginView },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  // 使用 hash 模式：打包后双击 dist/index.html（file:// 协议）也能正常跳转
  history: createWebHashHistory(),
  routes
})

// 简易路由守卫：未登录不能进控制台
router.beforeEach((to) => {
  if (to.meta.requiresAuth && !session.isLogin()) {
    return { name: 'login' }
  }
})

export default router
