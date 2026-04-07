<template>
  <div class="h-[100vh] flex flex-col">
    <!-- 顶部安全区 -->
    <div v-if="current !== 3" class="van-safe-area-top" />
    <!-- 顶部 navbar -->
    <div
      v-if="current !== 3"
      class="h-44px flex items-center justify-between border-b border-b-[#E0E0E0] bg-[#ededed] px-16px"
    >
      <div class="w-60px" />
      <div class="text-17px font-medium">
        {{ navbarTitle }}
      </div>
      <div class="w-60px flex items-center justify-end gap-20px">
        <van-icon name="search" size="22" />
        <van-icon name="add-o" size="22" @click="showPopup = !showPopup" />
      </div>
    </div>
    <!-- + 号弹出菜单遮罩 -->
    <div v-if="showPopup" class="fixed inset-0 z-998" @click="showPopup = false" />
    <!-- + 号弹出菜单 -->
    <div
      v-if="showPopup"
      class="fixed right-12px z-999 rounded-6px bg-[#4c4c4c] py-4px before:absolute before:right-10px before:top-[-10px] before:border-6px before:border-transparent before:border-b-[#4c4c4c] before:border-solid before:content-['']"
      :style="{ top: 'calc(env(safe-area-inset-top) + 44px)' }"
    >
      <div
        v-for="(item, index) in popupMenus"
        :key="item.text"
        class="flex items-center px-20px py-12px"
        :class="[index !== popupMenus.length - 1 ? 'border-b-[0.5px] border-b-[#666] border-b-solid' : '']"
        @click="onPopupMenuClick(item.text)"
      >
        <div :class="item.icon" class="h-20px w-20px text-[#fff]" />
        <span class="ml-12px text-15px text-[#fff]">{{ item.text }}</span>
      </div>
    </div>
    <!-- 内容区 -->
    <div class="min-h-0 flex-1 overflow-y-auto bg-[#ededed]">
      <Wx v-if="current === 0" />
      <Address v-if="current === 1" />
      <Find v-if="current === 2" />
      <Mine v-if="current === 3" />
    </div>
    <!-- 底部 tabbar -->
    <div class="h-52px flex shrink-0 items-center border-t border-gray-200 bg-white">
      <div
        v-for="item in tabbars"
        :key="item.index"
        class="relative flex flex-1 flex-col cursor-pointer items-center justify-center"
        @click="change(item.index)"
      >
        <!-- 图标容器 -->
        <div class="relative">
          <img
            :src="current === item.index ? item.icon.active : item.icon.inactive"
            class="h-24px w-24px"
          >
          <!-- badge 徽章 -->
          <span
            v-if="item.badge"
            class="absolute h-16px min-w-16px flex items-center justify-center rounded-full bg-red-500 px-4px text-10px text-white -right-10px -top-1px"
          >
            {{ item.badge > 99 ? '99+' : item.badge }}
          </span>
          <!-- dot 红点 -->
          <span
            v-else-if="item.dot"
            class="absolute h-8px w-8px rounded-full bg-red-500 -right-2px -top-2px"
          />
        </div>
        <!-- 标题 -->
        <span
          class="mt-2px text-10px"
          :class="current === item.index ? 'text-green-500' : 'text-gray-500'"
        >
          {{ item.title }}
        </span>
      </div>
    </div>
    <!-- 底部安全区 -->
    <div class="van-safe-area-bottom" />
  </div>
</template>

<script lang="ts" setup>
import { useLocalStorage } from '@vueuse/core'
import { showToast } from 'vant'
import Wx from './components/wx.vue'
import Address from './components/address.vue'
import Find from './components/find.vue'
import Mine from './components/mine.vue'

import ImgWxActive from '@/assets/images/wx.png'
import ImgWxInactive from '@/assets/images/wx-active.png'
import ImgAddressBookActive from '@/assets/images/addressBook.png'
import ImgAddressBookInactive from '@/assets/images/addressBook-active.png'
import ImgFindActive from '@/assets/images/find.png'
import ImgFindInactive from '@/assets/images/find-active.png'
import ImgMineActive from '@/assets/images/mine.png'
import ImgMineInactive from '@/assets/images/mine-active.png'

interface TabBarItem {
  title: string
  index: number
  badge?: number
  dot?: boolean
  icon: {
    active: string
    inactive: string
  }
}

const current = useLocalStorage('tabbar-current', 0)

// navbar 标题
const navbarTitle = computed(() => {
  const titles = ['微信(10)', '通讯录', '发现']
  return titles[current.value]
})

function change(index: number) {
  current.value = index
}

// + 号弹出菜单
const showPopup = ref(false)

const popupMenus = [
  { icon: 'i-wx-group-chat', text: '发起群聊' },
  { icon: 'i-wx-add-friend', text: '添加朋友' },
  { icon: 'i-wx-scan', text: '扫一扫' },
  { icon: 'i-wx-payment', text: '收付款' },
]

function onPopupMenuClick(text: string) {
  showPopup.value = false
  showToast(text)
}

const tabbars = ref<TabBarItem[]>([
  {
    title: '微信',
    index: 0,
    badge: 10,
    icon: {
      active: ImgWxInactive,
      inactive: ImgWxActive,
    },
  },
  {
    title: '通讯录',
    index: 1,
    icon: {
      active: ImgAddressBookInactive,
      inactive: ImgAddressBookActive,
    },
  },
  {
    title: '发现',
    index: 2,
    icon: {
      active: ImgFindInactive,
      inactive: ImgFindActive,
    },
    dot: true,
  },
  {
    title: '我',
    index: 3,
    icon: {
      active: ImgMineInactive,
      inactive: ImgMineActive,
    },
  },
])
</script>

<style lang="less" scoped></style>
