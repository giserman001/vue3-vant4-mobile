<template>
  <div class="h-full flex flex-col bg-[#ededed]">
    <!-- 顶部导航栏 -->
    <van-nav-bar
      :border="false"
      class="!border-b-1 !border-b-[#e1e1e1] !border-b-solid bg-[#ededed]!"
      @click-left="router.back"
    >
      <template #left>
        <!-- @unocss-skip-start -->
        <van-icon name="cross" size="20" color="#000" />
        <!-- @unocss-skip-end -->
      </template>
      <template #right>
        <!-- @unocss-skip-start -->
        <van-icon name="ellipsis" size="20" color="#000" />
        <!-- @unocss-skip-end -->
      </template>
    </van-nav-bar>

    <!-- 错误内容区域 -->
    <div class="flex flex-1 flex-col items-center pt-15">
      <!-- 感叹号图标 -->
      <div class="i-ph-warning-circle-fill bg-[#d9d9d9] text-14" />

      <!-- 错误提示文字 -->
      <p class="mt-5 text-3.5 text-[#999] tracking-0.5">
        网络出错，无法显示该页面
      </p>
    </div>

    <!-- 底部重试按钮 -->
    <div class="px-28 pb-20">
      <button
        class="h-11 w-full rounded-[6px] bg-[#d9d9d9] text-3.5 text-[#333] tracking-2"
        @click="handleRetry"
      >
        重试
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function handleRetry() {
  // 返回上一页或刷新当前页
  if (window.history.length > 1) {
    router.back()
  }
  else {
    router.replace('/')
  }
}
</script>
