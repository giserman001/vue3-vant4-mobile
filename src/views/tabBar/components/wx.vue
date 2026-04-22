<template>
  <div class="bg-white">
    <!-- 顶部登录提示 -->
    <div class="h-36px flex items-center gap-18px bg-[#ededed] px-20px">
      <img src="@/assets/images/pc.png" alt="电脑" class="h-20px w-20px">
      <span class="text-13px text-[#6a6a6a]">Windows 微信已登录</span>
    </div>
    <!-- 聊天列表 -->
    <div>
      <van-swipe-cell
        v-for="item in chatList"
        :key="item.id"
        :class="item.top ? 'bg-[#f3f3f3]' : 'bg-white'"
      >
        <div
          class="flex select-none items-center pl-12px pt-12px active:bg-[#e5e5e5]"
          @click="goToChat(item.id)"
          @touchstart="handleTouchStart(item.id, $event)"
          @touchend="handleTouchEnd"
          @touchmove="handleTouchMove"
          @contextmenu.prevent
        >
          <!-- 头像 -->
          <div class="relative mr-12px shrink-0 pb-12px">
            <img :src="item.avatar" alt="头像" loading="lazy" class="h-48px w-48px rounded-4px">
            <!-- 未读徽章 -->
            <span
              v-if="item.unread > 0"
              class="absolute h-16px min-w-16px flex items-center justify-center rounded-full bg-[#fa5151] px-4px text-10px text-white -right-4px -top-4px"
            >
              {{ item.unread > 99 ? '99+' : item.unread }}
            </span>
          </div>
          <!-- 内容区 -->
          <div class="min-w-0 flex flex-1 flex-col justify-center border-b border-b-[#E0E0E0] pb-12px pr-12px">
            <div class="flex items-center justify-between">
              <span class="truncate text-16px text-[#1a1a1a]">{{ item.name }}</span>
              <span class="ml-8px shrink-0 text-12px text-[#b2b2b2]">{{ getLastMessageTime(item) }}</span>
            </div>
            <div class="mt-4px truncate text-13px text-[#b2b2b2]">
              {{ getLastMessageContent(item) }}
            </div>
          </div>
        </div>
        <!-- 左滑操作按钮 -->
        <template #right>
          <div class="h-full flex">
            <button
              class="h-full w-80px flex items-center justify-center bg-[#c7c7cc] text-14px text-white"
              @click="handleMarkUnread(item.id)"
            >
              未读
            </button>
            <button
              class="h-full w-80px flex items-center justify-center bg-[#ff3b30] text-14px text-white"
              @click="handleDelete(item.id)"
            >
              删除
            </button>
          </div>
        </template>
      </van-swipe-cell>
    </div>

    <!-- 设置未读弹框 -->
    <van-dialog
      v-model:show="showUnreadDialog"
      title="设置未读"
      show-cancel-button
      confirm-button-text="确定"
      cancel-button-text="取消"
      @confirm="confirmUnread"
      @cancel="cancelUnread"
    >
      <div class="px-20px py-20px">
        <input
          v-model="unreadCount"
          type="number"
          class="h-44px w-full border border-[#e5e5e5] rounded-8px bg-white px-16px text-center text-16px text-[#333] outline-none focus:border-[#1989fa]"
          placeholder="请输入未读消息数量"
        >
      </div>
    </van-dialog>

    <!-- 长按菜单 -->
    <div
      v-if="showActionMenu"
      class="fixed z-2000"
      :style="menuStyle"
      @click.stop
    >
      <div class="min-w-140px overflow-hidden rounded-4px bg-white shadow-lg">
        <div
          v-for="(action) in menuActions"
          :key="action.id"
          class="h-44px flex items-center justify-center px-20px text-15px text-[#1a1a1a]"
          @click="onMenuSelect(action)"
        >
          {{ action.text }}
        </div>
      </div>
    </div>

    <!-- 遮罩层 - 点击关闭菜单 -->
    <div
      v-if="showActionMenu"
      class="fixed inset-0 z-1999 bg-transparent"
      @click="showActionMenu = false"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/store/modules/app'
import type { ChatListItem } from '@/store/modules/app'

const router = useRouter()
const appStore = useAppStore()

// 聊天列表
const chatList = computed(() => appStore.getChatList)

// 未读弹框相关
const showUnreadDialog = ref(false)
const unreadCount = ref('')
const currentChatId = ref(0)

// 长按菜单相关
const showActionMenu = ref(false)
const longPressTimer = ref<NodeJS.Timeout | null>(null)
const longPressDelay = 600 // 长按延迟时间（毫秒）
const touchPosition = ref({ x: 0, y: 0 })
const menuPosition = ref<'top' | 'bottom'>('top')

// 菜单样式 - 菜单左上角对齐手指位置，向右下方展开，带边缘检测
const menuStyle = computed(() => {
  const menuWidth = 140 // 菜单最小宽度
  const menuHeight = 44 * 4 // 4个菜单项，每项44px
  const screenWidth = window.innerWidth
  const screenHeight = window.innerHeight
  const padding = 16 // 屏幕边缘留白

  let left = touchPosition.value.x
  let top = touchPosition.value.y

  // 右边缘检测：如果菜单会超出右边界，则向左展开
  if (left + menuWidth > screenWidth - padding) {
    left = screenWidth - menuWidth - padding
  }

  // 左边缘检测：确保不超出左边界
  if (left < padding) {
    left = padding
  }

  // 下边缘检测：如果菜单会超出下边界，则向上展开
  if (top + menuHeight > screenHeight - padding) {
    top = touchPosition.value.y - menuHeight
  }

  // 上边缘检测：确保不超出上边界
  if (top < padding) {
    top = padding
  }

  return {
    left: `${left}px`,
    top: `${top}px`,
  }
})

// 菜单项
const menuActions = [
  { text: '标为未读', id: 'markUnread' },
  { text: '置顶该聊天', id: 'toggleTop' },
  { text: '不显示该聊天', id: 'hideChat' },
  { text: '删除该聊天', id: 'deleteChat' },
]

// 当前选中的聊天
const _currentChat = computed(() => {
  return chatList.value.find(item => item.id === currentChatId.value)
})

// 获取最后一条消息内容
function getLastMessageContent(item: ChatListItem): string {
  const lastMsg = item.messages[item.messages.length - 1]
  return lastMsg ? lastMsg.content : ''
}

// 获取最后一条消息时间
function getLastMessageTime(item: ChatListItem): string {
  const lastMsg = item.messages[item.messages.length - 1]
  if (!lastMsg) {
    return ''
  }

  // 简化时间显示
  const time = lastMsg.time
  const now = new Date()
  const today = `${now.getMonth() + 1}月${now.getDate()}日`

  if (time.includes(today)) {
    // 今天的消息只显示时间
    return time.split(' ')[1] || time
  }
  return time
}

// 进入聊天页面
function goToChat(id: number) {
  const chatId = appStore.enterChatById(id)
  router.push(`/chat/${chatId}`)
}

// 长按开始
function handleTouchStart(id: number, event: TouchEvent) {
  // 如果已有菜单显示，先关闭它，然后立即开始新的长按检测
  if (showActionMenu.value) {
    showActionMenu.value = false
    // 清除之前的定时器
    if (longPressTimer.value) {
      clearTimeout(longPressTimer.value)
      longPressTimer.value = null
    }
  }

  // 记录触摸位置
  const touch = event.touches[0]
  touchPosition.value = { x: touch.clientX, y: touch.clientY }

  longPressTimer.value = setTimeout(() => {
    currentChatId.value = id
    // 根据触摸位置决定菜单显示位置
    const screenHeight = window.innerHeight
    // 如果触摸位置在屏幕下半部分，菜单显示在上方；否则显示在下方
    menuPosition.value = touchPosition.value.y > screenHeight / 2 ? 'top' : 'bottom'
    // 触发震动反馈（如果设备支持）
    if (navigator.vibrate) {
      navigator.vibrate(50) // 震动 50ms
    }
    showActionMenu.value = true
  }, longPressDelay)
}

// 长按结束
function handleTouchEnd() {
  if (longPressTimer.value) {
    clearTimeout(longPressTimer.value)
    longPressTimer.value = null
  }
}

// 触摸移动 - 取消长按
function handleTouchMove() {
  if (longPressTimer.value) {
    clearTimeout(longPressTimer.value)
    longPressTimer.value = null
  }
}

// 标记未读 - 打开弹框
function handleMarkUnread(id: number) {
  currentChatId.value = id
  unreadCount.value = ''
  showUnreadDialog.value = true
}

// 确认设置未读
function confirmUnread() {
  const count = Number.parseInt(unreadCount.value, 10)
  if (count > 0) {
    appStore.setUnread(currentChatId.value, count)
  }
  showUnreadDialog.value = false
  unreadCount.value = ''
}

// 取消设置未读
function cancelUnread() {
  showUnreadDialog.value = false
  unreadCount.value = ''
}

// 删除聊天
function handleDelete(id: number) {
  appStore.deleteChat(id)
}

// 菜单选择处理
function onMenuSelect(action: { text: string, id: string }) {
  switch (action.id) {
    case 'markUnread':
      appStore.setUnread(currentChatId.value, 1)
      break
    case 'toggleTop':
      appStore.toggleTop(currentChatId.value)
      break
    case 'hideChat':
      // 不显示该聊天 - 暂无功能
      break
    case 'deleteChat':
      appStore.deleteChat(currentChatId.value)
      break
  }
  showActionMenu.value = false
}
</script>

<style lang="less" scoped></style>
