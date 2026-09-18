# NOVA 控制台 · Vue 3 工程版

由原来的单文件 `login.html` 改造而来的标准 **Vue 3 + Vite** 工程。
炫彩极光背景、粒子星空、玻璃拟态卡片全部保留，登录校验后可跳转控制台页。

## 演示账号

| 账号 | 密码 | 身份 |
|------|------|------|
| `nova` | `2026` | SUPER ADMIN（创始人） |
| `admin` | `123456` | ADMIN（运维） |
| `guest` | `guest` | GUEST（只读） |
| `13800138000` | `8888` | MEMBER（会员） |

也可以直接点 Google / Apple 图标走第三方快捷登录（演示）。

## 启动方式

### 方式一：完整工程（需要 Node.js ≥ 18）

```bash
npm install          # 首次安装依赖
npm run dev          # 开发模式，浏览器自动打开 http://127.0.0.1:5173
npm run build        # 打包到 dist/（产物可直接双击 index.html 打开）
npm run preview      # 本地预览打包结果
```

### 方式二：免安装版（无需 Node）

直接双击根目录的 **`standalone.html`** 即可运行。
该文件内嵌了 Vue 3 CDN 版本，功能与工程版一致，但需要联网加载 Vue。

## 目录结构

```
nova-vue/
├── index.html                  入口 HTML
├── vite.config.js              Vite 配置（含 @ 别名、相对路径打包）
├── package.json
├── standalone.html             免安装单文件版
└── src/
    ├── main.js                 应用入口
    ├── App.vue                 根组件（背景层 + 路由视图 + 页面过渡）
    ├── style.css               全局样式与设计令牌
    ├── router/index.js         路由配置（hash 模式 + 登录守卫）
    ├── data/accounts.js        演示账号数据与校验逻辑
    ├── stores/session.js       会话 Store（reactive，无额外依赖）
    ├── components/
    │   ├── GlowBackground.vue  极光 / 网格 / 扫描光 / 噪点 / 暗角
    │   ├── StarField.vue       Canvas 粒子星空（含鼠标连线）
    │   ├── BrandPanel.vue      左侧品牌展示区
    │   ├── LoginForm.vue       登录表单（校验 / 动效 / 第三方登录）
    │   ├── StatCard.vue        指标卡（数字滚动动画）
    │   └── TrendChart.vue      流量趋势 SVG 折线图
    └── views/
        ├── LoginView.vue       登录页
        └── DashboardView.vue   控制台页（登录后跳转目标）
```

## 技术要点

- **Vue 3 `<script setup>`** 组合式 API
- **Vue Router 4**，采用 `createWebHashHistory`，保证打包后 `file://` 直接双击也能正常跳转
- **路由守卫**：未登录访问 `/dashboard` 会被重定向回登录页
- **轻量状态管理**：用 `reactive` + `computed` 自实现 session store，不引入 Pinia，减少依赖
- **会话持久化**：登录信息写入 `sessionStorage`，刷新不丢失；"记住此设备"写入 `localStorage` 自动回填账号
- **路由采用 base `./`**：`npm run build` 后 dist 可直接静态部署或本地打开

## 自定义修改

- 改账号：`src/data/accounts.js`
- 改配色：根目录下的 CSS 变量，集中在 `src/style.css` 的 `:root`
- 改控制台数据：`src/views/DashboardView.vue` 里的 `trend` / `feed` / 指标卡数组
