<template>
  <div class="h-full flex flex-col bg-[#EDEDED]">
    <!-- 导航栏 -->
    <van-nav-bar
      :border="false"
      class="bg-[#fff]! !pb-2"
      @click-left="router.back()"
    >
      <template #left>
        <!-- @unocss-skip-start -->
        <van-icon name="arrow-left" size="22" color="#000" />
        <!-- @unocss-skip-end -->
      </template>
      <template #right>
        <!-- @unocss-skip-start -->
        <van-icon name="ellipsis" size="22" color="#000" />
        <!-- @unocss-skip-end -->
      </template>
    </van-nav-bar>

    <!-- 用户信息区域 -->
    <div class="bg-white px-4 pb-5 pt-2">
      <div class="flex items-start gap-3.5">
        <!-- 头像 -->
        <img
          :src="userInfo.avatar"
          class="h-16.5 w-16.5 rounded-lg object-cover"
          loading="lazy"
          alt="avatar"
        >
        <!-- 信息 -->
        <div class="flex flex-1 flex-col pt-0.5">
          <!-- 显示名（备注名或昵称） -->
          <div class="flex items-center gap-1.5">
            <span class="text-xl text-[#111] font-semibold">
              {{ isSelf ? userInfo.nickname : userInfo.remarkName }}
            </span>
            <span class="text-lg text-[#5d9dfe]">
              {{ isSelf ? '👤' : '👤' }}
            </span>
          </div>
          <!-- 昵称（仅他人显示） -->
          <div v-if="!isSelf" class="mt-1 text-[15px] text-[#666]">
            昵称：{{ userInfo.nickname }}
          </div>
          <!-- 微信号 -->
          <div class="mt-0.5 text-[15px] text-[#666]">
            微信号：{{ userInfo.wxId }}
          </div>
          <!-- 地区 -->
          <div class="mt-0.5 text-[15px] text-[#666]">
            地区：{{ userInfo.region }}
          </div>
        </div>
      </div>
    </div>

    <!-- 朋友资料 & 电话（仅他人显示） -->
    <template v-if="!isSelf">
      <div class="border-t border-[#f0f0f0] bg-white px-4">
        <div class="flex items-center justify-between py-3.5">
          <span class="text-base text-[#111]">朋友资料</span>
          <!-- @unocss-skip-start -->
          <van-icon name="arrow" size="16" color="#c8c9cc" />
          <!-- @unocss-skip-end -->
        </div>
      </div>
      <div class="bg-white px-4">
        <div class="flex items-center pb-3.5">
          <span class="text-base text-[#666]">电话</span>
          <span class="ml-4 text-base text-[#576b95]">{{ userInfo.phone }}</span>
        </div>
      </div>
    </template>

    <!-- 朋友圈 & 视频号（仅自己显示） -->
    <div v-if="isSelf" class="mt-2 bg-white px-4">
      <!-- 朋友圈 -->
      <div class="flex items-start justify-between gap-x-6 py-3.5">
        <span class="text-base text-[#111]">朋友圈</span>
        <div class="flex flex-1 items-center justify-between gap-2">
          <div class="flex gap-1">
            <img
              v-for="(img, idx) in userInfo.moments.slice(0, 4)"
              :key="idx"
              :src="img"
              loading="lazy"
              class="h-11.5 w-11.5 rounded-sm object-cover"
            >
          </div>
          <!-- @unocss-skip-start -->
          <van-icon name="arrow" size="16" color="#c8c9cc" />
          <!-- @unocss-skip-end -->
        </div>
      </div>
      <!-- 分隔线 -->
      <div class="h-px bg-[#f0f0f0]" />
      <!-- 视频号 -->
      <div class="flex items-start justify-between gap-x-6 py-3.5">
        <span class="text-base text-[#111]">视频号</span>
        <div class="flex flex-1 flex-col gap-y-2">
          <span class="text-[15px] text-[#666]">{{ userInfo.videoChannel }}</span>
          <div class="flex items-center justify-between">
            <!-- 第二行：图片列表 -->
            <div class="flex gap-1">
              <img
                v-for="(img, idx) in userInfo.videos.slice(0, 4)" :key="idx" :src="img"
                loading="lazy"
                class="h-11.5 w-11.5 rounded-sm object-cover"
              >
            </div>
            <!-- @unocss-skip-start -->
            <van-icon name="arrow" size="16" color="#c8c9cc" />
            <!-- @unocss-skip-end -->
          </div>
        </div>
      </div>
    </div>

    <!-- 操作按钮区 -->
    <div class="mt-2 bg-white">
      <!-- 发消息 -->
      <div
        class="flex items-center justify-center gap-2 border-b border-[#f0f0f0] py-4 active:bg-[#f5f5f5]"
        @click="handleSendMessage"
      >
        <div class="i-wx-send-msg h-5 w-5 text-[#576b95]" />
        <span class="text-base text-[#576b95]">发消息</span>
      </div>
      <!-- 音视频通话（仅他人显示） -->
      <div
        v-if="!isSelf"
        class="flex items-center justify-center gap-2 py-4 active:bg-[#f5f5f5]"
        @click="handleCall"
      >
        <div class="i-wx-yspth h-5 w-5 text-[#576b95]" />
        <span class="text-base text-[#576b95]">音视频通话</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/store/modules/app'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

// 通过路由参数判断是自己还是他人
// /userProfile -> 自己, /userProfile/:id -> 他人
const isSelf = computed(() => !route.params.id)

// 预加载通讯录头像图片
const avatarImgModules = import.meta.glob('@/assets/images/address-book/*.jpg', {
  eager: true,
  import: 'default',
}) as Record<string, string>

function getAvatarImg(num: number): string {
  const key = `/src/assets/images/address-book/${num}.jpg`
  return avatarImgModules[key] || ''
}

// 自己的用户数据：从 store userInfo 映射
const storeUser = appStore.getUserInfo
const selfInfo = computed(() => ({
  nickname: storeUser.name,
  remarkName: '',
  wxId: storeUser.wxNumber,
  region: storeUser.local,
  phone: '',
  avatar: storeUser.avatar,
  moments: [
    'https://picsum.photos/100/100?random=11',
    'https://picsum.photos/100/100?random=12',
    'https://picsum.photos/100/100?random=13',
    'https://picsum.photos/100/100?random=14',
  ],
  videoChannel: '瑶彤的爸',
  videos: [
    'https://picsum.photos/100/100?random=21',
    'https://picsum.photos/100/100?random=22',
    'https://picsum.photos/100/100?random=23',
    'https://picsum.photos/100/100?random=24',
  ],
}))

// 他人信息：从 store 的通讯录数据中动态获取
const otherInfo = computed(() => {
  const avatarIdx = Number(route.params.id)
  const contact = appStore.findContactByAvatarIdx(avatarIdx)
  if (contact) {
    return {
      nickname: contact.name,
      remarkName: contact.name,
      wxId: `wxid_${Math.random().toString(36).slice(2, 12)}`,
      region: '未知',
      phone: '',
      avatar: getAvatarImg(contact.avatarIdx),
      moments: [],
      videoChannel: '',
      videos: [],
    }
  }
  // 兜底：找不到联系人时的默认数据
  return {
    nickname: '未知用户',
    remarkName: '未知用户',
    wxId: '',
    region: '',
    phone: '',
    avatar: '',
    moments: [],
    videoChannel: '',
    videos: [],
  }
})

const userInfo = computed(() => isSelf.value ? selfInfo.value : otherInfo.value)

function handleSendMessage() {
  if (isSelf.value) {
    // 自己：进入文件传输助手或其他逻辑
    // router.push('/chat/0')

  }
  else {
    // 他人：查找或创建聊天，确保头像一致
    const chatId = appStore.enterChatByContact(otherInfo.value.nickname, otherInfo.value.avatar)
    router.push(`/chat/${chatId}`)
  }
}

function handleCall() {
  // 音视频通话
}
</script>
