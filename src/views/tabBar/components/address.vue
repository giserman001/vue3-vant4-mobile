<template>
  <div class="relative bg-[#ededed]">
    <!-- 功能入口列表 -->
    <div class="bg-white">
      <div
        v-for="(item, idx) in topList"
        :key="item.label"
        class="flex items-center pl-12px"
      >
        <img :src="item.icon" alt="" class="mr-12px h-40px w-40px shrink-0 rounded-6px">
        <div
          class="h-60px min-w-0 flex flex-1 items-center pr-12px"
          :class="idx < topList.length - 1 ? 'border-b border-b-[#ECECEC]' : ''"
        >
          <span class="text-17px text-[#000]">{{ item.label }}</span>
        </div>
      </div>
    </div>

    <!-- 分组标题 -->
    <div class="h-28px flex items-center px-12px text-13px text-[#808080] leading-28px">
      {{ indexList1[0].letter }}
    </div>

    <!-- 企业微信列表 -->
    <div class="bg-white">
      <div
        v-for="(item, idx) in indexList1[0].list"
        :key="item.name"
        class="flex items-center pl-12px"
      >
        <img :src="item.icon" alt="" class="mr-12px h-40px w-40px shrink-0 rounded-6px">
        <div
          class="h-60px min-w-0 flex flex-1 items-center pr-12px"
          :class="idx < indexList1[0].list.length - 1 ? 'border-b border-b-[#ECECEC]' : ''"
        >
          <span class="text-17px text-[#000]">{{ item.name }}</span>
        </div>
      </div>
    </div>

    <!-- 字母索引分组 -->
    <template v-for="group in contactGroups" :key="group.letter">
      <div class="h-28px flex items-center px-12px text-13px text-[#808080] leading-28px">
        {{ group.letter }}
      </div>
      <div class="bg-white">
        <div
          v-for="(item, idx) in group.list"
          :key="item.name"
          class="flex items-center pl-12px"
        >
          <img :src="getAvatarImg(item.avatarIdx)" alt="" class="mr-12px h-40px w-40px shrink-0 rounded-6px">
          <div
            class="h-60px min-w-0 flex flex-1 items-center pr-12px"
            :class="idx < group.list.length - 1 ? 'border-b border-b-[#ECECEC]' : ''"
          >
            <span class="text-17px text-[#000]">{{ item.name }}</span>
          </div>
        </div>
      </div>
    </template>

    <!-- 底部好友数量 -->
    <div class="h-60px flex items-center justify-center">
      <span
        class="text-14px text-[#808080]"
        @click="showModal = true"
      >
        {{ friendCount }}个朋友
      </span>
    </div>

    <!-- 右侧字母索引栏 -->
    <div class="fixed right-4px top-1/2 z-10 flex flex-col items-center text-11px text-[#808080] -translate-y-1/2">
      <span v-for="letter in indexLetters" :key="letter" class="px-2px py-0.5px leading-tight">
        {{ letter }}
      </span>
    </div>

    <!-- 修改好友数量弹窗 -->
    <van-dialog
      v-model:show="showModal"
      title="修改好友显示数量"
      show-confirm-button
      show-cancel-button
      confirm-button-text="修改"
      confirm-button-color="#07C160"
      @confirm="updateCount"
      @cancel="showModal = false"
    >
      <div class="p-16px">
        <input
          v-model="inputCount"
          type="number"
          placeholder="请输入新的好友数量"
          class="h-44px w-full border border-[#E5E5E5] rounded-4px px-12px text-16px text-[#000] outline-none focus:border-[#07C160] placeholder:text-[#B2B2B2]"
        >
        <div class="mt-12px text-center">
          <span
            class="text-14px text-[#576B95]"
            @click="resetCount"
          >
            恢复默认
          </span>
        </div>
      </div>
    </van-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAppStore } from '@/store/modules/app'
import IconNewFriend from '@/assets/images/icon/new-friend.png'
import IconTalkFriend from '@/assets/images/icon/talk-friend.png'
import IconGroupChat from '@/assets/images/icon/group-chat.png'
import IconTag from '@/assets/images/icon/tag.png'
import IconOfficialAccounts from '@/assets/images/icon/official-accounts.png'
import IconCompanyWx from '@/assets/images/icon/company-wx-friend.png'

const appStore = useAppStore()

// 弹窗控制
const showModal = ref(false)
const friendCount = ref(1081)
const inputCount = ref(1081)
const defaultCount = 1081

// 重置为默认值
function resetCount() {
  inputCount.value = defaultCount
}

// 更新好友数量
function updateCount() {
  const count = Number(inputCount.value)
  if (count > 0) {
    friendCount.value = count
  }
  showModal.value = false
}

// 预加载所有头像图片
const avatarImgModules = import.meta.glob('@/assets/images/address-book/*.jpg', {
  eager: true,
  import: 'default',
}) as Record<string, string>

function getAvatarImg(num: number): string {
  const key = `/src/assets/images/address-book/${num}.jpg`
  return avatarImgModules[key] || ''
}

// 功能入口列表
const topList = [
  { icon: IconNewFriend, label: '新的朋友' },
  { icon: IconTalkFriend, label: '仅聊天的朋友' },
  { icon: IconGroupChat, label: '群聊' },
  { icon: IconTag, label: '标签' },
  { icon: IconOfficialAccounts, label: '公众号' },
  { icon: IconCompanyWx, label: '服务号' },
]

// 企业微信分组
const indexList1 = [
  {
    letter: '我的企业及企业联系人',
    list: [
      { name: '企业微信联系人', icon: IconCompanyWx },
      { name: '企业微信通知', icon: IconCompanyWx },
    ],
  },
]

// 从 store 获取通讯录数据
const contactGroups = appStore.contactGroups

// 右侧字母索引
const indexLetters = [
  '↑',
  '☆',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
  '#',
]
</script>

<style lang="less" scoped>

</style>
