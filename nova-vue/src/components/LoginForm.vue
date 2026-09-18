<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { verifyAccount } from '@/data/accounts'
import { session } from '@/stores/session'

const emit = defineEmits(['success', 'error'])

/* ---------- 表单数据 ---------- */
const form = reactive({ user: '', pass: '' })
const remember = ref(true)
const showPass = ref(false)

const loading = ref(false)
const btnText = ref('登 录 控 制 台')

const errorMsg = ref('')
const badField = ref('')          // 'user' | 'pass' | ''

const ICON_USER =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23fff' stroke-width='2'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'/%3E%3Ccircle cx='12' cy='7' r='4'/%3E%3C/svg%3E\")"
const ICON_LOCK =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23fff' stroke-width='2'%3E%3Crect x='3' y='11' width='18' height='11' rx='2'/%3E%3Cpath d='M7 11V7a5 5 0 0 1 10 0v4'/%3E%3C/svg%3E\")"
const ICON_GOOGLE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23000'%3E%3Cpath d='M21.35 11.1h-9.18v2.96h5.28c-.23 1.4-1.62 4.1-5.28 4.1-3.18 0-5.78-2.63-5.78-5.88s2.6-5.88 5.78-5.88c1.81 0 3.02.77 3.71 1.43l2.53-2.44C16.6 3.9 14.4 3 12.17 3 7.18 3 3.14 7.03 3.14 12s4.04 9 9.03 9c5.21 0 8.66-3.66 8.66-8.82 0-.59-.06-1.04-.15-1.48z'/%3E%3C/svg%3E\")"
const ICON_APPLE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23000'%3E%3Cpath d='M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.78 1.18-.19 2.27-.84 3.5-.87 1.5-.07 2.86.61 3.75 1.7-3.14 1.87-2.63 6.06.42 7.24-.7 1.86-1.66 3.02-2.75 4.12zM12.03 7.25c-.04-2.67 2.2-4.74 4.64-4.74.18 2.93-2.5 5.16-4.64 4.74z'/%3E%3C/svg%3E\")"

const SOCIALS = [
  { key: 'google', name: 'Google', icon: ICON_GOOGLE },
  { key: 'apple',  name: 'Apple',  icon: ICON_APPLE }
]

const hasError = computed(() => !!errorMsg.value)

/* ---------- 方法 ---------- */
function clearError() {
  errorMsg.value = ''
  badField.value = ''
}

function showError(message, field) {
  errorMsg.value = message
  badField.value = field || ''
  emit('error')
}

function togglePass() {
  showPass.value = !showPass.value
}

/** 登录成功入场动画 + 写入会话 */
function enter(account, via) {
  loading.value = true
  clearError()
  btnText.value = '验 证 中'

  setTimeout(() => {
    btnText.value = '验 证 通 过'

    if (remember.value) session.remember(account.user)
    else session.forget()

    session.login(account, via)

    setTimeout(() => {
      btnText.value = '正 在 进 入'
      emit('success')
    }, 700)
  }, 900)
}

function onSubmit() {
  if (loading.value) return
  const result = verifyAccount(form.user, form.pass)

  if (!result.ok) {
    showError(result.message, result.field)
    // 密码错误时清空，方便重输
    if (result.field === 'pass') form.pass = ''
    return
  }
  enter(result.account)
}

/** 第三方快捷登录（演示） */
function socialLogin(item) {
  if (loading.value) return
  const seed = [...item.name].reduce((a, c) => a + c.charCodeAt(0), 0)
  const list = ['NOVA 管理员', '系统管理员', '访客用户', '张 · 用户']
  const account = {
    user: item.key,
    name: list[Math.abs(seed) % list.length],
    role: 'OAUTH',
    tag: item.name
  }
  enter(account, `${item.name} 授权`)
}

onMounted(() => {
  const saved = session.rememberedUser()
  if (saved) form.user = saved
})
</script>

<template>
  <section class="panel">
    <h2>欢迎回来</h2>
    <p class="tip">请输入账号信息以进入控制台</p>

    <form autocomplete="off" @submit.prevent="onSubmit">
      <Transition name="err">
        <div class="err show" v-if="hasError">
          <i></i><span>{{ errorMsg }}</span>
        </div>
      </Transition>

      <div class="field" :class="{ bad: badField === 'user' }">
        <input id="user" type="text" v-model="form.user" placeholder=" " @input="clearError" />
        <label for="user">用户名 / 邮箱</label>
        <i class="icon" :style="{ '--m': ICON_USER }"></i>
      </div>

      <div class="field" :class="{ bad: badField === 'pass' }">
        <input
          id="pass"
          :type="showPass ? 'text' : 'password'"
          v-model="form.pass"
          placeholder=" "
          @input="clearError"
        />
        <label for="pass">登录密码</label>
        <i class="icon" :style="{ '--m': ICON_LOCK }"></i>
        <i class="icon eye" :style="{ opacity: showPass ? 1 : '' }" title="显示/隐藏密码" @click="togglePass"></i>
      </div>

      <div class="row">
        <label class="remember">
          <input type="checkbox" v-model="remember" />
          <i class="box"></i>记住此设备
        </label>
        <a href="#" @click.prevent>忘记密码？</a>
      </div>

      <button class="btn" type="submit" :class="{ loading }">
        <i class="spin"></i><span>{{ btnText }}</span>
      </button>
    </form>

    <div class="divider">OR CONTINUE WITH</div>

    <div class="social">
      <div
        class="soc"
        v-for="item in SOCIALS"
        :key="item.key"
        @click="socialLogin(item)"
      >
        <i :style="{ '--m': item.icon }"></i>{{ item.name }}
      </div>
    </div>

    <div class="hint">
      演示账号：<code>nova</code> / <code>2026</code>，另有
      <code>admin</code>/<code>123456</code>、<code>guest</code>/<code>guest</code>
    </div>

    <p class="signup">还没有账号？<a href="#" @click.prevent>立即申请权限</a></p>
  </section>
</template>

<style scoped>
.err-enter-active { transition: opacity .3s ease, transform .3s ease; }
.err-leave-active { transition: opacity .2s ease; }
.err-enter-from   { opacity: 0; transform: translateY(-8px); }
.err-leave-to     { opacity: 0; }
.remember input { position: absolute; opacity: 0; }
</style>
