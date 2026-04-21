<template>
  <div class="chat-page h-screen flex flex-col bg-[#ededed] dark:bg-[#111]">
    <!-- 顶部导航栏 -->
    <div class="chat-header flex items-center justify-between border-b border-gray-200 bg-[#ededed] px-3 py-2.5 dark:border-gray-800 dark:bg-[#111]">
      <div class="w-8 flex items-center justify-center" @click="router.back()">
        <van-icon name="arrow-left" class="text-xl text-black dark:text-white" />
      </div>
      <div class="flex-1 text-center">
        <span class="text-lg text-black font-medium dark:text-white">{{ currentFriend.name }}</span>
      </div>
      <div class="relative">
        <div class="w-8 flex items-center justify-center" @click="showSwitchMenu = !showSwitchMenu">
          <van-icon name="ellipsis" class="text-xl text-black dark:text-white" />
        </div>
        <!-- 切换菜单 -->
        <div
          v-if="showSwitchMenu"
          class="absolute right-0 top-10 z-50 min-w-[180px] rounded-lg bg-[#4c4c4c] px-4 py-2"
          @click.stop
        >
          <div class="flex items-center gap-2 py-2" @click="toggleChatMode">
            <div class="h-4 w-4 flex items-center justify-center border-2 border-white rounded-full">
              <div v-if="isSelfMode" class="h-2 w-2 rounded-full bg-white" />
            </div>
            <span class="text-sm text-white">{{ isSelfMode ? '切换好友聊天开启' : '切换好友聊天关闭' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 消息列表区域 -->
    <div ref="messageContainer" class="flex-1 overflow-y-auto px-3 py-4 space-y-4">
      <template v-for="(msg, index) in displayedMessages" :key="index">
        <!-- 时间分隔线 -->
        <div v-if="msg.showTime" class="flex justify-center py-2">
          <span class="text-xs text-gray-400">{{ msg.time }}</span>
        </div>

        <!-- 系统提示消息（居中灰色文字，无头像无气泡） -->
        <div v-if="msg.type === 'system'" class="flex justify-center py-1">
          <span class="text-xs text-[#b2b2b2] leading-5">{{ msg.content }}</span>
        </div>

        <!-- 好友消息 (左侧) -->
        <div v-else-if="msg.isFriend" class="flex items-start gap-2.5">
          <img :src="currentFriend.avatar" class="h-10 w-10 flex-shrink-0 rounded-md object-cover">
          <div class="max-w-[70%] flex flex-col gap-1">
            <div class="rounded-r-lg rounded-bl-lg bg-white px-3 py-2.5 text-base text-black leading-relaxed shadow-sm dark:bg-[#2c2c2c] dark:text-white">
              {{ msg.content }}
            </div>
          </div>
        </div>

        <!-- 自己消息 (右侧) -->
        <div v-else class="flex flex-row-reverse items-start gap-2.5">
          <img :src="selfAvatar" class="h-10 w-10 flex-shrink-0 rounded-md object-cover">
          <div class="max-w-[70%] flex flex-col items-end gap-1">
            <div class="rounded-l-lg rounded-br-lg bg-[#95ec69] px-3 py-2.5 text-base text-black leading-relaxed shadow-sm dark:bg-[#7cb342]">
              {{ msg.content }}
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- 底部输入区域 -->
    <div class="chat-footer flex items-center gap-3 border-t border-gray-200 bg-[#f7f7f7] px-3 py-2 dark:border-gray-800 dark:bg-[#1a1a1a]">
      <!-- 语音按钮 -->
      <div class="h-8 w-8 flex items-center justify-center">
        <van-icon name="volume-o" class="text-2xl text-black dark:text-white" />
      </div>

      <!-- 输入框 -->
      <div class="flex-1 rounded-md bg-white px-3 py-2 dark:bg-[#2c2c2c]">
        <input
          v-model="inputMessage"
          type="text"
          class="w-full bg-transparent text-base text-black outline-none dark:text-white"
          placeholder=""
          @keyup.enter="sendMessage"
        >
      </div>

      <!-- 表情按钮 -->
      <div class="h-8 w-8 flex items-center justify-center">
        <van-icon name="smile-o" class="text-2xl text-black dark:text-white" />
      </div>

      <!-- 更多按钮 -->
      <div class="h-8 w-8 flex items-center justify-center">
        <van-icon name="plus" class="text-2xl text-black dark:text-white" />
      </div>
    </div>

    <!-- 点击遮罩关闭菜单 -->
    <div
      v-if="showSwitchMenu"
      class="fixed inset-0 z-40"
      @click="showSwitchMenu = false"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/store/modules/app'

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()

// 当前聊天ID
const chatId = computed(() => Number(route.params.id))

// 当前好友信息
const currentFriend = computed(() => {
  const chat = appStore.getChatList.find(item => item.id === chatId.value)
  return {
    id: chat?.id || 0,
    name: chat?.name || '',
    avatar: chat?.avatar || '',
  }
})

// 自己头像
const selfAvatar = appStore.selfAvatar

// 切换菜单显示状态
const showSwitchMenu = ref(false)
// 是否为自己模式（模拟好友视角）
// false = 默认自己发送（绿色气泡），true = 切换好友发送（白色气泡）
const isSelfMode = ref(false)

// 输入消息
const inputMessage = ref('')

// 消息容器引用
const messageContainer = ref<HTMLElement>()

// 聊天数据
const chatData = computed(() => {
  const chat = appStore.getChatList.find(item => item.id === chatId.value)
  return chat?.messages || []
})

// 显示的消息
const displayedMessages = computed(() => {
  return chatData.value
})

// 滚动到底部
function scrollToBottom() {
  nextTick(() => {
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight
    }
  })
}

// 切换聊天模式
function toggleChatMode() {
  isSelfMode.value = !isSelfMode.value
  showSwitchMenu.value = false
}

// 发送消息
function sendMessage() {
  if (!inputMessage.value.trim()) {
    return
  }

  // 使用 store 发送消息
  appStore.sendMessage(chatId.value, inputMessage.value, isSelfMode.value)

  inputMessage.value = ''
  scrollToBottom()
}

// 初始化
onMounted(() => {
  scrollToBottom()
})

// 监听消息变化自动滚动
watch(() => chatData.value.length, scrollToBottom)
</script>

<style scoped>
/* 隐藏滚动条但保留滚动功能 */
.chat-page ::-webkit-scrollbar {
  display: none;
}

.chat-page {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
