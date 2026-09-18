import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    // true = 监听 0.0.0.0，允许局域网（同一 WiFi / 网线）内的其他设备访问
    host: true,
    port: 5173,
    open: true
  },
  build: {
    outDir: 'dist',
    // 直接双击 dist/index.html 也能打开（file:// 协议）
    base: './'
  }
})
