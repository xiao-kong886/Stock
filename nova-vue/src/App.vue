<script setup>
import { RouterView } from 'vue-router'
import GlowBackground from '@/components/GlowBackground.vue'
import StarField from '@/components/StarField.vue'
</script>

<template>
  <!-- 全局背景层：所有页面共享 -->
  <div class="bg">
    <GlowBackground />
    <StarField />
  </div>

  <RouterView v-slot="{ Component }">
    <Transition name="page" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>
</template>

<style>
/* 页面切换过渡 */
.page-enter-active,
.page-leave-active {
  transition: opacity .45s ease, transform .45s cubic-bezier(.2,.9,.25,1), filter .45s ease;
}
.page-enter-from { opacity: 0; transform: translateY(26px) scale(.985); filter: blur(10px); }
.page-leave-to   { opacity: 0; transform: translateY(-14px) scale(.99); filter: blur(10px); }
</style>
