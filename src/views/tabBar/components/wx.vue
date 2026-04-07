<template>
  <div class="bg-white">
    <!-- 顶部登录提示 -->
    <div class="h-36px flex items-center gap-18px bg-[#ededed] px-20px">
      <img src="@/assets/images/pc.png" alt="电脑" class="h-20px w-20px">
      <span class="text-13px text-[#6a6a6a]">Windows 微信已登录</span>
    </div>
    <!-- 聊天列表 -->
    <div>
      <div
        v-for="(item, index) in list"
        :key="index"
        class="flex items-center pl-12px pt-12px active:bg-[#e5e5e5]"
        :class="item.top ? 'bg-[#f3f3f3]' : 'bg-white'"
        @click="goToChat(index)"
      >
        <!-- 头像 -->
        <div class="relative mr-12px shrink-0 pb-12px">
          <img :src="getHeadImg(index)" alt="头像" class="h-48px w-48px rounded-4px">
          <!-- 徽章 -->
          <span
            v-if="item.badge"
            class="absolute h-16px min-w-16px flex items-center justify-center rounded-full bg-[#fa5151] px-4px text-10px text-white -right-4px -top-4px"
          >
            {{ item.badge > 99 ? '99+' : item.badge }}
          </span>
        </div>
        <!-- 内容区 -->
        <div class="min-w-0 flex flex-1 flex-col justify-center border-b border-b-[#E0E0E0] pb-12px pr-12px">
          <div class="flex items-center justify-between">
            <span class="truncate text-16px text-[#1a1a1a]">{{ item.name }}</span>
            <span class="ml-8px shrink-0 text-12px text-[#b2b2b2]">{{ item.time }}</span>
          </div>
          <div class="mt-4px truncate text-13px text-[#b2b2b2]">
            {{ item.msg }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// 预加载所有头像图片
const headImgModules = import.meta.glob('@/assets/images/head-portrait/*.jpg', {
  eager: true,
  import: 'default',
}) as Record<string, string>

function getHeadImg(index: number): string {
  const key = `/src/assets/images/head-portrait/${index + 1}.jpg`
  return headImgModules[key] || ''
}

// 进入聊天页面
function goToChat(index: number) {
  router.push(`/chat/${index + 1}`)
}

interface ChatItem {
  name: string
  msg: string
  time: string
  badge?: number
  top?: boolean
}

const list: ChatItem[] = [
  { name: '热心网友', msg: '使用说明和打赏功能在下面的发现页面哦。', time: '09:20', badge: 2, top: true },
  { name: '李伟', msg: '8点钟，有骨气', time: '08:51', top: true },
  { name: '小兔乖乖', msg: '文件已经发过去了，请查收', time: '07:23', badge: 10 },
  { name: '李建明', msg: '明天8点，不见不散！', time: '07:20' },
  { name: '丽丽', msg: '你好啊，在忙吗？', time: '06:20' },
  { name: '王陵（北京顾客）', msg: '借我一点钱，明天就还你', time: '昨天20:20' },
  { name: '王小军', msg: '呵呵~~~~', time: '昨天19:20', badge: 1 },
  { name: '郑有海', msg: '[转账]您有一笔转账', time: '昨天18:23' },
  { name: '询价-刘经理', msg: '[图片]', time: '昨天15:20' },
  { name: 'Sina', msg: '照片我已经发过去了', time: '昨天13:56' },
  { name: '路飞', msg: '为什么不回信息', time: '昨天13:34' },
  { name: '渠道推荐16655665148', msg: '[文件]2022年价格表', time: '昨天12:20' },
  { name: 'Nothing', msg: '[ok]谢谢', time: '昨天11:20' },
  { name: 'AA空气炮', msg: '感谢您的信任与支持', time: '昨天10:11' },
  { name: '戴剑敏', msg: '。。。。。。。。', time: '昨天10:10' },
  { name: '胡伟立', msg: '[语音通话]', time: '昨天09:20' },
  { name: '小阿飞', msg: '我喜欢你', time: '昨天08:20' },
  { name: '丁锦', msg: '帮我一个忙，改天请你吃饭啊', time: '昨天08:10' },
  { name: '罗心悦', msg: '帮我朋友圈点个赞谢谢', time: '昨天07:20' },
  { name: '英卫小公主', msg: '你昨天去哪里了？', time: '昨天07:10' },
]
</script>

<style lang="less" scoped></style>
