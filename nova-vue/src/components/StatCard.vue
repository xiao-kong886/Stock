<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  label:   { type: String, required: true },
  value:   { type: Number, required: true },
  suffix:  { type: String, default: '' },
  decimals:{ type: Number, default: 0 },
  delta:   { type: String, default: '' },
  up:      { type: Boolean, default: true },   // true=涨(红) false=跌(绿)
  from:    { type: String, default: '#ff2d95' },
  to:      { type: String, default: '#7b2dff' }
})

const shown = ref(0)

function animate() {
  const duration = 1100
  const start = performance.now()
  const target = props.value
  function step(now) {
    const p = Math.min((now - start) / duration, 1)
    // easeOutCubic
    shown.value = target * (1 - Math.pow(1 - p, 3))
    if (p < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

onMounted(animate)
watch(() => props.value, animate)
</script>

<template>
  <div class="card" :style="{ '--gc1': from, '--gc2': to }">
    <div class="label">{{ label }}</div>
    <div class="value">
      {{ shown.toFixed(decimals) }}<span style="font-size:15px;font-weight:600">{{ suffix }}</span>
    </div>
    <div class="delta" :class="up ? 'up' : 'down'">{{ delta }}</div>
  </div>
</template>
