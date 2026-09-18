<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'

const canvasRef = ref(null)

const COLORS = ['#ff2d95', '#7b2dff', '#00e5ff', '#ffd400', '#ffffff']
const MAX_COUNT = 150
const LINK_DIST_SQ = 26000

let ctx = null
let stars = []
let w = 0
let h = 0
let rafId = null
let mouse = { x: null, y: null }
let dpr = 1

function resize() {
  const cv = canvasRef.value
  if (!cv) return
  dpr = window.devicePixelRatio || 1
  w = cv.width = Math.floor(window.innerWidth * dpr)
  h = cv.height = Math.floor(window.innerHeight * dpr)
  cv.style.width = '100%'
  cv.style.height = '100%'

  const count = Math.min(MAX_COUNT, Math.round(window.innerWidth / 11))
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: (Math.random() * 1.6 + 0.4) * dpr,
    vx: (Math.random() - 0.5) * 0.22 * dpr,
    vy: (Math.random() - 0.5) * 0.22 * dpr,
    c: COLORS[(Math.random() * COLORS.length) | 0],
    a: Math.random() * 0.6 + 0.25,
    tw: Math.random() * 0.02 + 0.006
  }))
}

function loop() {
  if (!ctx) return
  ctx.clearRect(0, 0, w, h)

  for (const s of stars) {
    s.x += s.vx
    s.y += s.vy
    if (s.x < 0 || s.x > w) s.vx *= -1
    if (s.y < 0 || s.y > h) s.vy *= -1

    s.a += s.tw
    if (s.a > 1 || s.a < 0.15) s.tw *= -1

    if (mouse.x !== null) {
      const dx = s.x - mouse.x
      const dy = s.y - mouse.y
      const d2 = dx * dx + dy * dy
      const limit = LINK_DIST_SQ * dpr
      if (d2 < limit) {
        ctx.strokeStyle = s.c
        ctx.globalAlpha = 0.18 * (1 - d2 / limit)
        ctx.lineWidth = dpr * 0.7
        ctx.beginPath()
        ctx.moveTo(s.x, s.y)
        ctx.lineTo(mouse.x, mouse.y)
        ctx.stroke()
      }
    }

    ctx.globalAlpha = Math.max(0.12, s.a)
    ctx.fillStyle = s.c
    ctx.shadowBlur = 9 * dpr
    ctx.shadowColor = s.c
    ctx.beginPath()
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowBlur = 0
  }

  ctx.globalAlpha = 1
  rafId = requestAnimationFrame(loop)
}

function onMouseMove(e) {
  dpr = window.devicePixelRatio || 1
  mouse.x = e.clientX * dpr
  mouse.y = e.clientY * dpr
}
function onMouseLeave() {
  mouse.x = mouse.y = null
}

onMounted(() => {
  ctx = canvasRef.value.getContext('2d')
  resize()
  window.addEventListener('resize', resize)
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseleave', onMouseLeave)
  rafId = requestAnimationFrame(loop)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(rafId)
  window.removeEventListener('resize', resize)
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseleave', onMouseLeave)
})
</script>

<template>
  <canvas id="stars" ref="canvasRef"></canvas>
</template>
