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
import IconNewFriend from '@/assets/images/icon/new-friend.png'
import IconTalkFriend from '@/assets/images/icon/talk-friend.png'
import IconGroupChat from '@/assets/images/icon/group-chat.png'
import IconTag from '@/assets/images/icon/tag.png'
import IconOfficialAccounts from '@/assets/images/icon/official-accounts.png'
import IconCompanyWx from '@/assets/images/icon/company-wx-friend.png'

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
const avatarImgModules = import.meta.glob('@/assets/images/avatar/*.jpg', {
  eager: true,
  import: 'default',
}) as Record<string, string>

function getAvatarImg(num: number): string {
  const key = `/src/assets/images/avatar/avatar-${num}.jpg`
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

// 联系人分组（startIdx 会在计算时自动修正）
const contactGroupsRaw = [
  {
    letter: 'A',
    list: [
      { name: 'A' },
      { name: 'A0 合肥·领达·汽车维修《宋瑞》' },
      { name: 'A9.（微信两分钟不回打电话）' },
      { name: '啊啊啊啊啊啊' },
      { name: '阿狸' },
      { name: 'AAA烧烤天下（2号）' },
    ],
  },
  {
    letter: 'B',
    list: [
      { name: '百年工匠' },
      { name: 'Boarding' },
      { name: '八百万' },
      { name: 'Bin' },
      { name: '白色天空' },
      { name: '毕业设计-小王' },
    ],
  },
  {
    letter: 'C',
    list: [
      { name: 'Camelia' },
      { name: '陈芳芳（2）' },
      { name: '陈艳' },
      { name: '陈燕' },
      { name: '程叔叔' },
      { name: '春天花开' },
      { name: '超市老板娘' },
    ],
  },
  {
    letter: 'D',
    list: [
      { name: '大壮' },
      { name: '丁锦' },
      { name: '戴剑敏' },
      { name: 'David' },
      { name: '当当网上书店' },
    ],
  },
  {
    letter: 'F',
    list: [
      { name: '广标硬件-陈' },
      { name: '风轻云淡' },
      { name: '缝纫机维修小杨' },
      { name: 'Flutter群主' },
    ],
  },
  {
    letter: 'G',
    list: [
      { name: '工作群' },
      { name: '管理员' },
      { name: '高小姐' },
    ],
  },
  {
    letter: 'H',
    list: [
      { name: '胡伟立' },
      { name: '黄子墨' },
      { name: '红叶' },
      { name: '海纳百川' },
      { name: 'Helen' },
    ],
  },
  {
    letter: 'J',
    list: [
      { name: '建明' },
      { name: '金融-刘经理' },
      { name: '加班狗' },
    ],
  },
  {
    letter: 'L',
    list: [
      { name: '李伟' },
      { name: '丽丽' },
      { name: '路飞' },
      { name: '罗心悦' },
      { name: '领导' },
      { name: '老妈' },
      { name: '老婆' },
    ],
  },
  {
    letter: 'M',
    list: [
      { name: '麻辣烫-小张' },
      { name: '美团外卖' },
      { name: 'Mike' },
    ],
  },
  {
    letter: 'S',
    list: [
      { name: 'Sina' },
      { name: '师傅' },
      { name: '孙小姐' },
      { name: '学姐' },
    ],
  },
  {
    letter: 'W',
    list: [
      { name: '王陵（北京顾客）' },
      { name: '王小军' },
      { name: '吴怡' },
      { name: '王老师' },
      { name: '外卖小哥' },
    ],
  },
  {
    letter: 'X',
    list: [
      { name: '小兔乖乖' },
      { name: '小阿飞' },
      { name: '询价-刘经理' },
      { name: '小明同学' },
    ],
  },
  {
    letter: 'Y',
    list: [
      { name: '英卫小公主' },
      { name: '杨师傅' },
      { name: '一号店长' },
    ],
  },
  {
    letter: 'Z',
    list: [
      { name: '郑有海' },
      { name: '张三' },
      { name: '周杰伦' },
      { name: '赵丽颖' },
    ],
  },
]

// 计算带正确 startIdx 的联系人分组
const contactGroups = (() => {
  let avatarIdx = 1
  return contactGroupsRaw.map(group => ({
    ...group,
    startIdx: avatarIdx,
    list: group.list.map((item, idx) => ({
      ...item,
      avatarIdx: avatarIdx + idx,
    })),
    _endIdx: (avatarIdx += group.list.length),
  }))
})()

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
