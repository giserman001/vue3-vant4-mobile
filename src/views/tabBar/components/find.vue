<template>
  <div class="bg-[#ededed]">
    <!-- 第一组：朋友圈 -->
    <div class="bg-white" @click="router.push('/circleFriend')">
      <div class="flex items-center pl-12px">
        <div class="i-wx-pyq mr-16px h-24px w-24px" />
        <div class="h-56px flex flex-1 items-center pr-12px">
          <span class="flex-1 text-17px text-[#000]">朋友圈</span>
          <div class="relative mr-8px">
            <img src="@/assets/images/head-portrait/1.jpg" alt="" class="h-32px w-32px rounded-4px">
            <span class="absolute h-8px w-8px rounded-full bg-red-500 -right-2px -top-2px" />
          </div>
          <van-icon name="arrow" color="#C8C8C8" size="16" />
        </div>
      </div>
    </div>

    <!-- 第二组：视频号、直播 -->
    <div class="h-8px" />
    <div class="bg-white">
      <div class="flex items-center pl-12px">
        <div class="i-wx-sph mr-16px h-24px w-24px" />
        <div class="h-56px flex flex-1 items-center border-b border-b-[#ECECEC] pr-12px">
          <span class="flex-1 text-17px text-[#000]">视频号</span>
          <van-icon name="arrow" color="#C8C8C8" size="16" />
        </div>
      </div>
      <div class="flex items-center pl-12px">
        <div class="i-wx-live mr-16px h-24px w-24px" />
        <div class="h-56px flex flex-1 items-center pr-12px">
          <span class="flex-1 text-17px text-[#000]">直播</span>
          <van-icon name="arrow" color="#C8C8C8" size="16" />
        </div>
      </div>
    </div>

    <!-- 第三组：扫一扫、听一听 -->
    <div class="h-8px" />
    <div class="bg-white">
      <div class="flex items-center pl-12px">
        <div class="i-wx-scan mr-16px h-24px w-24px text-[#3C86E0]" />
        <div class="h-56px flex flex-1 items-center border-b border-b-[#ECECEC] pr-12px">
          <span class="flex-1 text-17px text-[#000]">扫一扫</span>
          <van-icon name="arrow" color="#C8C8C8" size="16" />
        </div>
      </div>
      <div class="flex items-center pl-12px">
        <div class="i-wx-tyt mr-16px h-24px w-24px" />
        <div class="h-56px flex flex-1 items-center pr-12px">
          <span class="flex-1 text-17px text-[#000]">听一听</span>
          <van-icon name="arrow" color="#C8C8C8" size="16" />
        </div>
      </div>
    </div>

    <!-- 第四组：看一看、搜一搜 -->
    <div class="h-8px" />
    <div class="bg-white">
      <div class="flex items-center pl-12px">
        <div class="i-wx-kyk mr-16px h-24px w-24px" />
        <div class="h-56px flex flex-1 items-center border-b border-b-[#ECECEC] pr-12px">
          <span class="flex-1 text-17px text-[#000]">看一看</span>
          <van-icon name="arrow" color="#C8C8C8" size="16" />
        </div>
      </div>
      <div class="flex items-center pl-12px">
        <div class="i-wx-sys mr-16px h-24px w-24px" />
        <div class="h-56px flex flex-1 items-center pr-12px">
          <span class="flex-1 text-17px text-[#000]">搜一搜</span>
          <van-icon name="arrow" color="#C8C8C8" size="16" />
        </div>
      </div>
    </div>

    <!-- 第五组：附近的人 -->
    <div class="h-8px" />
    <div class="bg-white">
      <div class="flex items-center pl-12px">
        <div class="i-wx-fjdr mr-16px h-24px w-24px" />
        <div class="h-56px flex flex-1 items-center pr-12px">
          <span class="flex-1 text-17px text-[#000]">附近的人</span>
          <van-icon name="arrow" color="#C8C8C8" size="16" />
        </div>
      </div>
    </div>

    <!-- 第六组：游戏 -->
    <div class="h-8px" />
    <div class="bg-white">
      <div class="flex items-center pl-12px">
        <div class="i-wx-wxyx mr-16px h-24px w-24px" />
        <div class="h-56px flex flex-1 items-center pr-12px">
          <span class="flex-1 text-17px text-[#000]">游戏</span>
          <van-icon name="arrow" color="#C8C8C8" size="16" />
        </div>
      </div>
    </div>

    <!-- 第七组：小程序 -->
    <div class="h-8px" />
    <div class="bg-white">
      <div class="flex items-center pl-12px">
        <div class="i-wx-wxxcx mr-16px h-24px w-24px" />
        <div class="h-56px flex flex-1 items-center pr-12px">
          <span class="flex-1 text-17px text-[#000]">小程序</span>
          <van-icon name="arrow" color="#C8C8C8" size="16" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
</script>

<style lang="less" scoped>
</style>
