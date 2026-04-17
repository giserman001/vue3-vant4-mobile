import 'virtual:uno.css'
import 'vant/es/toast/style'
import 'vant/es/dialog/style'
import 'vant/es/notify/style'
import 'vant/es/image-preview/style'

// https://unocss.dev/guide/style-reset#tailwind-compat
// 此重置基于 Tailwind 重置，减去按钮的背景颜色覆盖，以避免与 UI 框架发生冲突。请参阅链接的问题。
import '@unocss/reset/tailwind-compat.css'

// Register icon sprite
import 'virtual:svg-icons-register'
import { createApp } from 'vue'
import { registerSW } from 'virtual:pwa-register'
import App from './App.vue'
import router, { setupRouter } from './router'
import { setupStore } from '@/store'

// 开发环境启用 vconsole
if (import.meta.env.DEV) {
  import('vconsole').then((module) => {
    const VConsole = module.default
    // eslint-disable-next-line no-new
    new VConsole()
  })
}

// 禁用移动端下拉刷新（iOS 和 Android）
document.addEventListener('touchmove', (e) => {
  if (e.target === document.body || e.target === document.documentElement) {
    e.preventDefault()
  }
}, { passive: false })

// 禁用 pull-to-refresh
document.body.style.overscrollBehavior = 'none'

async function bootstrap() {
  const app = createApp(App)
  // 挂载状态管理
  setupStore(app)
  // 挂载路由
  setupRouter(app)
  await router.isReady()
  // 路由准备就绪后挂载APP实例
  app.mount('#app', true)

  // 注册 Service Worker（开发和生产环境都启用，支持 PWA 调试）
  registerSW({
    immediate: true,
    onRegistered(r) {
      console.log('PWA Service Worker 已注册:', r)
    },
    onRegisterError(error) {
      console.error('PWA Service Worker 注册失败:', error)
    },
  })
}

void bootstrap()
