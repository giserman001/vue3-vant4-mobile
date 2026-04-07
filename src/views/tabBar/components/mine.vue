<template>
  <div class="bg-[#ededed]">
    <!-- 用户信息区 -->
    <div class="bg-white px-16px pb-20px pt-48px">
      <div class="flex items-center">
        <!-- 头像 -->
        <img :src="userInfo.avatar" alt="" class="mr-16px h-64px w-64px shrink-0 rounded-8px">
        <!-- 用户信息 -->
        <div class="min-w-0 flex-1">
          <div class="flex items-center justify-between">
            <span class="text-22px text-[#000] font-medium">{{ userInfo.name }}</span>
            <img src="@/assets/images/icon/qr.png" alt="" class="h-18px w-18px">
          </div>
          <div class="mt-8px flex items-center">
            <span class="text-15px text-[#888]">微信号：{{ userInfo.wxNumber }}</span>
            <van-icon name="arrow" color="#C8C8C8" size="16" class="ml-4px" />
          </div>
        </div>
      </div>
      <!-- 状态按钮区 -->
      <div class="mt-20px flex items-center justify-center gap-12px">
        <div class="h-32px flex items-center border border-[#E0E0E0] rounded-full px-16px text-14px text-[#888]">
          <van-icon name="plus" size="12" class="mr-4px" />状态
        </div>
        <div class="h-32px flex items-center border border-[#E0E0E0] rounded-full px-12px text-14px text-[#888]">
          <div class="mr-4px flex items-center">
            <img src="@/assets/images/head-portrait/1.jpg" alt="" class="h-20px w-20px border-2 border-white rounded-full -mr-8px">
            <img src="@/assets/images/head-portrait/2.jpg" alt="" class="h-20px w-20px border-2 border-white rounded-full -mr-8px">
            <img src="@/assets/images/head-portrait/3.jpg" alt="" class="h-20px w-20px border-2 border-white rounded-full">
          </div>
          <span>等7个朋友</span>
          <span class="ml-4px h-6px w-6px rounded-full bg-red-500" />
        </div>
      </div>
    </div>

    <!-- 服务 -->
    <div class="h-8px" />
    <div class="bg-white">
      <div class="flex items-center pl-12px">
        <div class="i-wx-mine-wxzf mr-16px h-24px w-24px" />
        <div class="h-56px flex flex-1 items-center pr-12px">
          <span class="flex-1 text-17px text-[#000]">服务</span>
          <van-icon name="arrow" color="#C8C8C8" size="16" />
        </div>
      </div>
    </div>

    <!-- 收藏、朋友圈、视频号和公众号、小店与卡包、表情 -->
    <div class="h-8px" />
    <div class="bg-white">
      <div class="flex items-center pl-12px">
        <div class="i-wx-mine-wxsc mr-16px h-24px w-24px" />
        <div class="h-56px flex flex-1 items-center border-b border-b-[#ECECEC] pr-12px">
          <span class="flex-1 text-17px text-[#000]">收藏</span>
          <van-icon name="arrow" color="#C8C8C8" size="16" />
        </div>
      </div>
      <div class="flex items-center pl-12px">
        <div class="i-wx-mine-wdpyq mr-16px h-24px w-24px" />
        <div class="h-56px flex flex-1 items-center border-b border-b-[#ECECEC] pr-12px">
          <span class="flex-1 text-17px text-[#000]">朋友圈</span>
          <van-icon name="arrow" color="#C8C8C8" size="16" />
        </div>
      </div>
      <!-- <div class="flex items-center pl-12px">
        <img src="@/assets/images/icon/15.png" alt="" class="mr-16px h-24px w-24px">
        <div class="h-56px flex flex-1 items-center border-b border-b-[#ECECEC] pr-12px">
          <span class="flex-1 text-17px text-[#000]">视频号和公众号</span>
          <van-icon name="arrow" color="#C8C8C8" size="16" />
        </div>
      </div> -->
      <div class="flex items-center pl-12px">
        <div class="i-wx-mine-xdykb mr-16px h-24px w-24px" />
        <div class="h-56px flex flex-1 items-center border-b border-b-[#ECECEC] pr-12px">
          <span class="flex-1 text-17px text-[#000]">小店与卡包</span>
          <van-icon name="arrow" color="#C8C8C8" size="16" />
        </div>
      </div>
      <div class="flex items-center pl-12px">
        <div class="i-wx-mine-wxbq mr-16px h-24px w-24px" />
        <div class="h-56px flex flex-1 items-center pr-12px">
          <span class="flex-1 text-17px text-[#000]">表情</span>
          <van-icon name="arrow" color="#C8C8C8" size="16" />
        </div>
      </div>
    </div>

    <!-- 设置 -->
    <div class="h-8px" />
    <div class="bg-white">
      <div class="flex items-center pl-12px">
        <div class="i-wx-mine-wxsz mr-16px h-24px w-24px" />
        <div class="h-56px flex flex-1 items-center pr-12px">
          <span class="flex-1 text-17px text-[#000]">设置</span>
          <van-icon name="arrow" color="#C8C8C8" size="16" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/store/modules/app'

const appStore = useAppStore()
const userInfo = computed(() => appStore.userInfo)
watchEffect(() => {
  console.log(userInfo.value)
})
</script>

<style lang="less" scoped>
</style>
