<script setup>
/**
 * 左侧品牌展示区
 */
const props = defineProps({
  stats: {
    type: Array,
    default: () => [
      { value: '99.99%', unit: '', label: 'SLA 可用性' },
      { value: '128',    unit: 'ms', label: '平均响应' },
      { value: '24/7',   unit: '', label: '全天候守护' }
    ]
  }
})
</script>

<template>
  <section class="brand">
    <div class="logo">
      <div class="sigil"></div>
      <div class="logo-text">NOVA<span>CONTROL CENTER</span></div>
    </div>

    <div class="hero">
      <h1>掌控全局<em>由此开始</em></h1>
      <p>连接你的数字中枢，实时调度资源、洞察数据脉搏，让每一次决策都快人一步。</p>

      <div class="stats">
        <div class="stat" v-for="s in props.stats" :key="s.label">
          <b>{{ s.value }}<span v-if="s.unit" style="font-size:14px">{{ s.unit }}</span></b>
          <span>{{ s.label }}</span>
        </div>
      </div>
    </div>
  </section>
</template>
