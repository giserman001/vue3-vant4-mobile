import { computed, ref } from 'vue'

type Direction = 'forward' | 'backward' | 'none'

const direction = ref<Direction>('none')
const historyStack = ref<string[]>([])

/**
 * 微信风格路由过渡动画 composable
 * - 维护路由历史栈，判断导航方向（forward/backward）
 * - 根据方向和路由 meta.transition 配置返回过渡动画名称
 */
export function useRouteTransition() {
  const router = useRouter()

  // 初始化：将当前路由加入栈
  if (historyStack.value.length === 0) {
    historyStack.value.push(router.currentRoute.value.fullPath)
  }

  router.beforeEach((to, from) => {
    const targetPath = to.fullPath
    const stackLength = historyStack.value.length

    // 判断是否是返回操作：目标路径等于栈中倒数第二个
    if (stackLength >= 2 && historyStack.value[stackLength - 2] === targetPath) {
      // 返回操作：弹出当前路由
      direction.value = 'backward'
      historyStack.value.pop()
    }
    else {
      // 前进操作：压入新路由
      direction.value = 'forward'
      historyStack.value.push(targetPath)
    }

    // 仅当来源和目标路由都禁用动画时才不执行动画
    // 例如：Login(false) → TabBar(false) 无动画
    // 但：TabBar(false) → circleFriend(undefined) 有动画
    if (to.meta?.transition === false && from.meta?.transition === false) {
      direction.value = 'none'
    }
  })

  const transitionName = computed(() => {
    switch (direction.value) {
      case 'forward':
        return 'wx-slide-right'
      case 'backward':
        return 'wx-slide-left'
      default:
        return undefined
    }
  })

  return {
    direction,
    transitionName,
    historyStack,
  }
}
