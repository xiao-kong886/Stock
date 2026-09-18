<script setup>
import { computed } from 'vue'

const props = defineProps({
  data:  { type: Array,  default: () => [] },   // [{ label:'周一', value:320 }, ...]
  height:{ type: Number, default: 180 }
})

const W = 600
const H = 200
const PAD_X = 14
const PAD_TOP = 16
const PAD_BOTTOM = 26

const points = computed(() => {
  const vals = props.data.map(d => d.value)
  const max = Math.max(...vals) * 1.15
  const min = Math.min(...vals) * 0.85
  const span = max - min || 1
  const n = props.data.length
  return props.data.map((d, i) => {
    const x = n === 1 ? W / 2 : PAD_X + (i * (W - PAD_X * 2)) / (n - 1)
    const y = PAD_TOP + (1 - (d.value - min) / span) * (H - PAD_TOP - PAD_BOTTOM)
    return { x, y, ...d }
  })
})

const linePath = computed(() =>
  points.value.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
)
const areaPath = computed(() => {
  if (!points.value.length) return ''
  const first = points.value[0]
  const last = points.value[points.value.length - 1]
  return `${linePath.value} L${last.x.toFixed(1)},${H - PAD_BOTTOM} L${first.x.toFixed(1)},${H - PAD_BOTTOM} Z`
})
</script>

<template>
  <div class="chart">
    <svg :viewBox="`0 0 ${W} ${H}`" preserveAspectRatio="none" class="svg">
      <defs>
        <linearGradient id="ln" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stop-color="#ff2d95" />
          <stop offset="50%"  stop-color="#7b2dff" />
          <stop offset="100%" stop-color="#00e5ff" />
        </linearGradient>
        <linearGradient id="ar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="#7b2dff" stop-opacity=".45" />
          <stop offset="100%" stop-color="#7b2dff" stop-opacity="0" />
        </linearGradient>
      </defs>

      <!-- 辅助横线 -->
      <line v-for="i in 4" :key="i"
            :x1="PAD_X" :x2="W - PAD_X"
            :y1="PAD_TOP + ((i - 1) * (H - PAD_TOP - PAD_BOTTOM)) / 3"
            :y2="PAD_TOP + ((i - 1) * (H - PAD_TOP - PAD_BOTTOM)) / 3"
            stroke="rgba(255,255,255,.07)" stroke-width="1" />

      <path :d="areaPath" fill="url(#ar)" />
      <path :d="linePath" fill="none" stroke="url(#ln)" stroke-width="3"
            stroke-linecap="round" stroke-linejoin="round" />

      <circle v-for="(p, i) in points" :key="i"
              :cx="p.x" :cy="p.y" r="4" fill="#05060f" stroke="#00e5ff" stroke-width="2">
        <animate attributeName="r" values="4;6;4" dur="2.4s"
                 :begin="`${i * 0.18}s`" repeatCount="indefinite" />
      </circle>
    </svg>

    <div class="xlabs">
      <span v-for="p in points" :key="p.label">{{ p.label }}</span>
    </div>
  </div>
</template>

<style scoped>
.chart { width: 100%; }
.svg { width: 100%; height: 200px; display: block; overflow: visible; }
.xlabs {
  display: flex; justify-content: space-between;
  margin-top: 10px; font-size: 11px; color: rgba(255,255,255,.5); letter-spacing: 1px;
}
</style>
