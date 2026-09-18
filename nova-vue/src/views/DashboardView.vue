<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { session } from '@/stores/session'
import StatCard from '@/components/StatCard.vue'
import TrendChart from '@/components/TrendChart.vue'

const router = useRouter()

const user = computed(() => session.user)

const initials = computed(() => (user.value?.name || 'N').trim().slice(0, 1))

const loginTime = computed(() => {
  const t = user.value?.loginAt
  if (!t) return '--'
  const d = new Date(t)
  const p = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
})

const trend = [
  { label: '周一', value: 2100 },
  { label: '周二', value: 2680 },
  { label: '周三', value: 2340 },
  { label: '周四', value: 3120 },
  { label: '周五', value: 3890 },
  { label: '周六', value: 3520 },
  { label: '周日', value: 4260 }
]

const feed = [
  { text: '集群节点 nova-node-07 完成自动扩容', time: '2 分钟前', color: '#00e5ff' },
  { text: '安全策略更新：新增 3 条风控规则',     time: '18 分钟前', color: '#7b2dff' },
  { text: '数据报表日报已生成并推送至邮箱',       time: '1 小时前', color: '#ffd400' },
  { text: 'API 网关 QPS 峰值回落至正常区间',     time: '3 小时前', color: '#ff2d95' },
  { text: '完成一次全量数据备份（1.2 TB）',      time: '昨天 23:40', color: '#00e5ff' }
]

function logout() {
  session.logout()
  router.replace({ name: 'login' })
}
</script>

<template>
  <div class="dash">
    <!-- 顶部栏 -->
    <div class="topbar">
      <div style="display:flex;align-items:center;gap:14px">
        <div class="avatar"><b>{{ initials }}</b></div>
        <div>
          <div style="font-size:16px;font-weight:700;letter-spacing:.5px">{{ user?.name }}</div>
          <span class="role">{{ user?.role }} · {{ user?.tag }}</span>
        </div>
      </div>
      <button class="logout" @click="logout">退出登录</button>
    </div>

    <!-- 欢迎 -->
    <div class="greet">
      <h1>欢迎回来，<em>{{ user?.name }}</em></h1>
      <p>登录方式：{{ user?.via }} &nbsp;·&nbsp; 登录时间：{{ loginTime }}</p>
    </div>

    <!-- 指标卡 -->
    <TransitionGroup name="card" tag="div" class="cards" appear>
      <StatCard
        v-for="c in [
          { label:'今日活跃用户', value:42860, suffix:' 人', delta:'较昨日 +12.4%', up:true,  from:'#ff2d95', to:'#7b2dff' },
          { label:'订单总额',     value:386420, suffix:' 元', delta:'较昨日 +8.1%',  up:true,  from:'#7b2dff', to:'#00e5ff' },
          { label:'平均响应',     value:128, suffix:' ms', decimals:0, delta:'较昨日 -6.3%',  up:false, from:'#00e5ff', to:'#23d18b' },
          { label:'系统可用性',   value:99.99, suffix:' %', decimals:2, delta:'连续 180 天达标', up:true, from:'#ffd400', to:'#ff2d95' }
        ]"
        :key="c.label"
        :label="c.label" :value="c.value" :suffix="c.suffix"
        :decimals="c.decimals" :delta="c.delta" :up="c.up"
        :from="c.from" :to="c.to"
      />
    </TransitionGroup>

    <!-- 图表面板 -->
    <div class="panels">
      <div class="block">
        <h3>流量趋势</h3>
        <div class="sub">LAST 7 DAYS</div>
        <TrendChart :data="trend" />
      </div>

      <div class="block">
        <h3>最近动态</h3>
        <div class="sub">ACTIVITY FEED</div>
        <ul class="feed">
          <li v-for="(f, i) in feed" :key="i">
            <i class="dot" :style="{ '--dc': f.color }"></i>
            <div>
              <p>{{ f.text }}</p>
              <time>{{ f.time }}</time>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-enter-active { transition: opacity .5s ease, transform .5s cubic-bezier(.2,.9,.25,1); }
.card-enter-from { opacity: 0; transform: translateY(20px); }
</style>
