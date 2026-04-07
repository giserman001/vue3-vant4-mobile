import { onMounted, onUnmounted } from 'vue'
import router from '@/router'

/**
 * 微信风格手势滑动返回
 * - 从屏幕左边缘（20px 内）开始向右滑动
 * - 滑动距离超过屏幕宽度 1/3 时触发 router.back()
 * - 支持 iOS 和 Android 触摸事件
 */
export function useSwipeBack() {
  let startX = 0
  let startY = 0
  let isTracking = false

  const EDGE_THRESHOLD = 20 // 左边缘触发区域宽度 (px)
  const SWIPE_RATIO = 1 / 3 // 滑动距离占屏幕宽度的比例阈值

  function onTouchStart(e: TouchEvent) {
    const touch = e.touches[0]
    // 仅当触摸起始点在左边缘内才激活
    if (touch.clientX <= EDGE_THRESHOLD) {
      startX = touch.clientX
      startY = touch.clientY
      isTracking = true
    }
  }

  function onTouchMove(e: TouchEvent) {
    if (!isTracking) {
      return
    }

    const touch = e.touches[0]
    const deltaX = touch.clientX - startX
    const deltaY = Math.abs(touch.clientY - startY)

    // 如果纵向滑动大于横向，取消手势识别（用户在滚动页面）
    if (deltaY > Math.abs(deltaX)) {
      isTracking = false
    }
  }

  function onTouchEnd(e: TouchEvent) {
    if (!isTracking) {
      return
    }
    isTracking = false

    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - startX
    const screenWidth = window.innerWidth

    // 向右滑动距离超过屏幕宽度 1/3，触发返回
    if (deltaX > screenWidth * SWIPE_RATIO) {
      // 检查当前路由是否允许手势返回（不是根页面）
      if (window.history.length > 1) {
        router.back()
      }
    }
  }

  onMounted(() => {
    document.addEventListener('touchstart', onTouchStart, { passive: true })
    document.addEventListener('touchmove', onTouchMove, { passive: true })
    document.addEventListener('touchend', onTouchEnd, { passive: true })
  })

  onUnmounted(() => {
    document.removeEventListener('touchstart', onTouchStart)
    document.removeEventListener('touchmove', onTouchMove)
    document.removeEventListener('touchend', onTouchEnd)
  })
}
