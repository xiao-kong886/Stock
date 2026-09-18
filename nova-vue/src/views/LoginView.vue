<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import BrandPanel from '@/components/BrandPanel.vue'
import LoginForm from '@/components/LoginForm.vue'

const router = useRouter()
const stageRef = ref(null)
const leaving = ref(false)
const shaking = ref(false)

/* 卡片鼠标视差 */
function onMouseMove(e) {
  if (leaving.value) return
  const x = e.clientX / window.innerWidth - 0.5
  const y = e.clientY / window.innerHeight - 0.5
  stageRef.value.style.transform =
    `perspective(1400px) rotateY(${x * 4.5}deg) rotateX(${-y * 4.5}deg)`
}

/* 表单校验失败 -> 抖动 */
function shake() {
  shaking.value = false
  void stageRef.value?.offsetWidth
  shaking.value = true
  setTimeout(() => (shaking.value = false), 500)
}

/* 登录成功 -> 卡片飞出 -> 跳转控制台 */
function onSuccess() {
  leaving.value = true
  const el = stageRef.value
  el.style.transition = 'transform .55s cubic-bezier(.4,0,.6,1), opacity .55s ease, filter .55s ease'
  el.style.transform = 'perspective(1400px) scale(.92) translateY(-14px)'
  el.style.opacity = '0'
  el.style.filter = 'blur(14px) brightness(2)'
  setTimeout(() => router.push({ name: 'dashboard' }), 520)
}

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove)
  const saved = window.localStorage.getItem('nova_user')
  if (saved) document.getElementById('pass')?.focus()
})
onBeforeUnmount(() => window.removeEventListener('mousemove', onMouseMove))
</script>

<template>
  <div class="stage" ref="stageRef" :class="{ shake: shaking }">
    <i class="corner c-tl"></i>
    <i class="corner c-br"></i>

    <BrandPanel />
    <LoginForm @success="onSuccess" @error="shake" />
  </div>
</template>
