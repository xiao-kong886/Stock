import { reactive, computed } from 'vue'

/**
 * 轻量会话 Store（不引入 Pinia，零额外依赖）
 * 登录状态同时写入 sessionStorage，刷新页面不丢失
 */
const SESSION_KEY = 'nova_session'
const REMEMBER_KEY = 'nova_user'

function readStorage() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const session = reactive({
  user: readStorage(),

  isLogin: () => !!session.user,

  login(account, via = '账号密码') {
    const payload = { ...account, via, loginAt: Date.now() }
    session.user = payload
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(payload))
    } catch { /* 隐私模式下忽略 */ }
  },

  logout() {
    session.user = null
    try {
      sessionStorage.removeItem(SESSION_KEY)
    } catch { /* noop */ }
  },

  remember(username) {
    try { localStorage.setItem(REMEMBER_KEY, username) } catch { /* noop */ }
  },

  forget() {
    try { localStorage.removeItem(REMEMBER_KEY) } catch { /* noop */ }
  },

  rememberedUser() {
    try { return localStorage.getItem(REMEMBER_KEY) || '' } catch { return '' }
  }
})

export const displayName = computed(() => session.user?.name || '未登录')
export default session
