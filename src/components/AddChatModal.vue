<template>
  <!-- 主弹窗 -->
  <van-dialog
    v-model:show="showMainModal"
    :show-confirm-button="false"
    :show-cancel-button="false"
    close-on-click-overlay
    class-name="add-chat-modal"
  >
    <div class="p-16px">
      <!-- 提示文字 -->
      <div class="mb-12px text-center text-14px text-[#999]">
        提示：群人数设置为1或空时，将添加为好友
      </div>

      <!-- 群头像和输入区域 -->
      <div class="mb-10px flex gap-4px">
        <!-- 群头像 -->
        <div class="w-65px flex flex-shrink-0 flex-col items-center gap-4px">
          <img
            :src="currentGroupAvatar"
            class="size-60px flex-shrink-0 rounded-8px object-cover"
          >
          <van-uploader
            v-model="avatarFileList"
            :max-count="1"
            :preview-image="false"
            :show-upload="true"
            result-type="dataUrl"
            accept="image/*"
            class="h-24px"
            :after-read="onAvatarAfterRead"
          >
            <button class="h-24px rounded-4px bg-[#07C160] px-4px text-12px text-white">
              修改头像
            </button>
          </van-uploader>
        </div>

        <!-- 输入区域 -->
        <div class="flex flex-1 flex-col gap-6px" style="min-width: 0;">
          <div class="flex gap-6px">
            <input
              v-model="groupName"
              type="text"
              placeholder="请输入群名称"
              class="h-32px min-w-0 flex-1 border border-[#E5E5E5] rounded-4px px-8px text-14px outline-none focus:border-[#07C160]"
            >
            <button
              class="h-32px w-56px flex-shrink-0 rounded-4px bg-[#07C160] text-14px text-white"
              @click="randomGroupName"
            >
              随机
            </button>
          </div>
          <div class="flex gap-6px">
            <input
              v-model="groupCount"
              type="number"
              placeholder="请输入群人数"
              class="h-32px min-w-0 flex-1 border border-[#E5E5E5] rounded-4px px-8px text-14px outline-none focus:border-[#07C160]"
              @input="onGroupCountChange"
            >
            <button
              class="h-32px w-56px flex-shrink-0 rounded-4px bg-[#FF4444] px-4px py-2px text-center text-12px text-white leading-tight"
              @click="addChat"
            >
              <div>添加</div>
              <div>聊天</div>
            </button>
          </div>
        </div>
      </div>

      <!-- 聊天列表统计 -->
      <div class="mb-12px flex items-center justify-between">
        <span class="text-14px text-[#666]">共{{ chatList.length }}个聊天</span>
        <span
          class="cursor-pointer text-14px text-[#576B95]"
          @click="clearAllChat"
        >
          一键清空
        </span>
      </div>

      <!-- 聊天列表 -->
      <div class="mb-16px max-h-200px overflow-y-auto">
        <div
          v-for="(item, index) in chatList"
          :key="index"
          class="mb-8px flex items-center gap-12px rounded-8px bg-[#F5F5F5] p-12px"
        >
          <img :src="item.avatar" class="h-48px w-48px rounded-8px object-cover">
          <div class="flex-1">
            <div class="text-16px text-[#333] font-medium">
              {{ item.name }}
            </div>
            <div class="text-14px text-[#999]">
              {{ item.isGroup ? `群聊：共${item.count}个人` : '好友' }}
            </div>
          </div>
          <van-icon
            name="close"
            class="cursor-pointer text-20px text-[#999]"
            @click="removeChat(index)"
          />
        </div>
      </div>

      <!-- 添加选项 -->
      <div class="mb-16px flex gap-24px">
        <van-checkbox-group v-model="addTargets" direction="horizontal" :min="1" @change="onTargetChange">
          <van-checkbox name="chat" icon-size="16px" checked-color="#07C160">
            添加到聊天列表
          </van-checkbox>
          <van-checkbox name="contact" icon-size="16px" checked-color="#07C160">
            添加到通讯录
          </van-checkbox>
        </van-checkbox-group>
      </div>

      <!-- 底部按钮 -->
      <div class="flex bg-white">
        <button
          class="flex-1 bg-white text-16px text-[#999]"
          @click="showMainModal = false"
        >
          取消
        </button>
        <button
          class="flex-1 bg-white text-16px text-[#07C160]"
          @click="showBatchModal = true"
        >
          批量
        </button>
        <button
          class="flex-1 bg-white text-16px text-[#07C160] font-medium"
          @click="confirmAdd"
        >
          确定
        </button>
      </div>
    </div>
  </van-dialog>

  <!-- 批量添加弹窗 -->
  <van-dialog
    v-model:show="showBatchModal"
    title="批量添加好友"
    show-cancel-button
    confirm-button-text="确定"
    cancel-button-text="取消"
    @confirm="batchAdd"
    @cancel="showBatchModal = false"
  >
    <div class="p-16px">
      <input
        v-model="batchCount"
        type="number"
        placeholder="请输入添加的好友数量"
        class="mb-12px h-44px w-full border border-[#E5E5E5] rounded-4px px-12px text-16px outline-none focus:border-[#07C160]"
      >
      <div class="text-14px text-[#999] leading-relaxed">
        请勿添加太多好友，可能会导致卡顿，200左右最佳，<span class="text-[#FF4444]">可点击通讯录最下面的好友总数直接修改显示数量</span>，若已添加太多好友，可使用重置功能恢复默认！
      </div>
    </div>
  </van-dialog>

  <!-- 头像选择弹窗 -->
  <van-popup
    v-model:show="showAvatarSelector"
    position="bottom"
    round
    :style="{ height: '60%' }"
  >
    <div class="p-16px">
      <div class="mb-16px text-center text-16px font-medium">
        选择群头像
      </div>
      <div class="grid grid-cols-4 max-h-300px gap-12px overflow-y-auto">
        <img
          v-for="item in availableGroupAvatars"
          :key="`${item.size}-${item.num}`"
          :src="getGroupAvatarUrl(item.size, item.num)"
          class="h-72px w-72px cursor-pointer rounded-8px object-cover"
          :class="{ 'ring-2 ring-[#07C160]': selectedGroupSize === item.size && selectedAvatarNum === item.num }"
          @click="selectGroupAvatar(item.size, item.num)"
        >
      </div>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { showConfirmDialog, showToast } from 'vant'
import { useAppStore } from '@/store/modules/app'

const appStore = useAppStore()

// 弹窗显示控制
const showMainModal = ref(false)
const showBatchModal = ref(false)
const showAvatarSelector = ref(false)

// 表单数据
const groupName = ref('')
const groupCount = ref('')
const addTargets = ref<string[]>(['chat']) // checkbox 模式，默认选中聊天列表
const batchCount = ref('')
const avatarFileList = ref<any[]>([]) // 头像上传文件列表

// 目标改变时校验，确保至少选择一个
function onTargetChange(value: string[]) {
  if (value.length === 0) {
    // 如果取消所有选择，恢复默认选择
    addTargets.value = ['chat']
    showToast('请至少选择一个添加目标')
  }
}

// 聊天列表（临时存储）
const chatList = ref<any[]>([])

// 群头像相关（从group-avatar获取，命名规则：group-{人数}-{序号}.jpg）
const selectedGroupSize = ref(3) // 当前选择的群人数（3-9）
const selectedAvatarNum = ref(1) // 当前选择的序号
const usedGroupAvatars = ref<Set<string>>(new Set()) // 已使用的群头像标识 "size-num"

// 群头像配置
const GROUP_AVATAR_CONFIG = {
  minSize: 2, // 最少2人
  maxSize: 9,
  countPerSize: { // 每个人数对应的头像数量
    2: 13, // 2人头像有13个
    3: 18,
    4: 16,
    5: 12,
    6: 14,
    7: 15,
    8: 16,
    9: 15,
  },
}

// 计算可用群头像
const availableGroupAvatars = computed(() => {
  const avatars: { size: number, num: number }[] = []
  for (let size = GROUP_AVATAR_CONFIG.minSize; size <= GROUP_AVATAR_CONFIG.maxSize; size++) {
    const count = GROUP_AVATAR_CONFIG.countPerSize[size as keyof typeof GROUP_AVATAR_CONFIG.countPerSize] || 0
    for (let num = 1; num <= count; num++) {
      if (!usedGroupAvatars.value.has(`${size}-${num}`)) {
        avatars.push({ size, num })
      }
    }
  }
  return avatars.slice(0, 20)
})

// 当前群头像（默认使用 group-avatar，可自定义上传）
const currentGroupAvatar = ref('')

// 初始化默认头像
function initDefaultAvatar() {
  currentGroupAvatar.value = getGroupAvatarUrl(selectedGroupSize.value, selectedAvatarNum.value)
}

// 组件挂载时初始化头像
onMounted(() => {
  initDefaultAvatar()
})

// 随机群名称
const groupNames = ['兴趣爱好交流', '工作交流群', '同学会', '内部沟通交流群', '家庭群', '朋友聚会', '技术讨论群', '读书分享群', '游戏交流群', '旅行分享群', '电影讨论群', '音乐分享群', '体育交流群', '美食分享群', '宠物养护群', '摄影爱好者群', '历史知识群', '科学讨论群', '编程技术群']

// 配置：最大群人数
const MAX_GROUP_COUNT = 100

function randomGroupName() {
  // 随机群名称
  groupName.value = groupNames[Math.floor(Math.random() * groupNames.length)]
  // 随机群人数（1-MAX_GROUP_COUNT）
  const count = Math.floor(Math.random() * MAX_GROUP_COUNT) + 1
  groupCount.value = String(count)
  // 根据人数更新头像
  updateAvatarByCount(count)
}

// 根据人数更新头像
function updateAvatarByCount(count: number) {
  const { size, num } = getRandomAvatarByCount(count)
  selectedGroupSize.value = size
  selectedAvatarNum.value = num
  // 1人使用单头像，2人及以上使用群头像
  if (size === 1) {
    const singleAvatarNum = Math.floor(Math.random() * 270) + 1
    currentGroupAvatar.value = new URL(`../assets/images/avatar/avatar-${singleAvatarNum}.jpg`, import.meta.url).href
  }
  else {
    currentGroupAvatar.value = getGroupAvatarUrl(size, num)
  }
}

// 群人数变化时更新头像
function onGroupCountChange() {
  const count = Number.parseInt(groupCount.value) || 0
  if (count > 0) {
    updateAvatarByCount(count)
  }
}

// 根据人数获取随机头像
function getRandomAvatarByCount(count: number): { size: number, num: number } {
  // 1人：使用单头像（从avatar文件夹随机选择）
  // 2人：使用2宫格
  // 3人：使用3宫格
  // 4人：使用4宫格
  // 5-9人：对应使用5-9宫格
  // 10人以上：使用9宫格
  let size: number
  if (count === 1) {
    // 1人使用单头像，返回特殊标记
    return { size: 1, num: 1 }
  }
  else if (count === 2) {
    size = 2
  }
  else if (count === 3) {
    size = 3
  }
  else if (count === 4) {
    size = 4
  }
  else if (count >= 5 && count <= 9) {
    size = count
  }
  else {
    size = 9
  }
  // 获取该人数对应的头像数量
  const avatarCount = GROUP_AVATAR_CONFIG.countPerSize[size as keyof typeof GROUP_AVATAR_CONFIG.countPerSize] || 1
  const num = Math.floor(Math.random() * avatarCount) + 1
  return { size, num }
}

// 获取群头像URL
function getGroupAvatarUrl(size: number, num: number): string {
  return new URL(`../assets/images/group-avatar/group-${size}-${num}.jpg`, import.meta.url).href
}

// 选择群头像
function selectGroupAvatar(size: number, num: number) {
  showAvatarSelector.value = false
  selectedGroupSize.value = size
  selectedAvatarNum.value = num
  currentGroupAvatar.value = getGroupAvatarUrl(size, num)
}

// 获取随机未使用的群头像
function getRandomGroupAvatar(): { size: number, num: number } {
  const available: { size: number, num: number }[] = []
  for (let size = GROUP_AVATAR_CONFIG.minSize; size <= GROUP_AVATAR_CONFIG.maxSize; size++) {
    const count = GROUP_AVATAR_CONFIG.countPerSize[size as keyof typeof GROUP_AVATAR_CONFIG.countPerSize] || 0
    for (let num = 1; num <= count; num++) {
      if (!usedGroupAvatars.value.has(`${size}-${num}`)) {
        available.push({ size, num })
      }
    }
  }
  if (available.length === 0) {
    usedGroupAvatars.value.clear() // 如果都用完了，清空重新使用
    // 随机返回一个
    const randomSize = Math.floor(Math.random() * (GROUP_AVATAR_CONFIG.maxSize - GROUP_AVATAR_CONFIG.minSize + 1)) + GROUP_AVATAR_CONFIG.minSize
    const count = GROUP_AVATAR_CONFIG.countPerSize[randomSize as keyof typeof GROUP_AVATAR_CONFIG.countPerSize] || 1
    return { size: randomSize, num: Math.floor(Math.random() * count) + 1 }
  }
  return available[Math.floor(Math.random() * available.length)]
}

// 头像文件选择（Vant Uploader after-read 事件）
function onAvatarAfterRead(file) {
  console.log('onAvatarAfterRead', file)
  // result-type="dataUrl" 时返回 content 为 base64
  if (file.content) {
    currentGroupAvatar.value = file.content
  }
  else if (file.url) {
    currentGroupAvatar.value = file.url
  }
  else if (file.file) {
    // 如果没有 content，手动读取
    const reader = new FileReader()
    reader.onload = (e) => {
      currentGroupAvatar.value = e.target?.result as string
    }
    reader.readAsDataURL(file.file)
  }
  // 清空文件列表，允许重复选择同一文件
  avatarFileList.value = []
}

// 添加聊天
function addChat() {
  const count = Number.parseInt(groupCount.value)
  const name = groupName.value.trim()

  if (!name) {
    showToast('请输入群名称')
    return
  }

  // 两人不成群，至少3人
  const isGroup = count >= 3

  // 获取随机群头像
  const { size, num } = getRandomGroupAvatar()
  usedGroupAvatars.value.add(`${size}-${num}`)

  chatList.value.push({
    name,
    count: count || 1,
    avatar: getGroupAvatarUrl(size, num),
    isGroup,
    groupSize: size,
    avatarNum: num,
  })

  // 重置输入
  groupName.value = ''
  groupCount.value = ''
  const newAvatar = getRandomGroupAvatar()
  selectedGroupSize.value = newAvatar.size
  selectedAvatarNum.value = newAvatar.num
}

// 移除聊天
function removeChat(index: number) {
  const item = chatList.value[index]
  usedGroupAvatars.value.delete(`${item.groupSize}-${item.avatarNum}`)
  chatList.value.splice(index, 1)
}

// 清空所有
async function clearAllChat() {
  await showConfirmDialog({
    title: '确认清空',
    message: '确定要清空所有聊天吗？',
  })
  chatList.value.forEach((item) => {
    usedGroupAvatars.value.delete(`${item.groupSize}-${item.avatarNum}`)
  })
  chatList.value = []
}

// 批量添加
function batchAdd() {
  const count = Number.parseInt(batchCount.value)
  if (!count || count <= 0) {
    showToast('请输入有效的数量')
    return
  }

  for (let i = 0; i < count; i++) {
    // 批量添加使用个人头像（从avatar文件夹）
    const avatarNum = Math.floor(Math.random() * 270) + 1

    chatList.value.push({
      name: `好友${Date.now()}_${i}`,
      count: 1,
      avatar: `/src/assets/images/avatar/avatar-${avatarNum}.jpg`,
      isGroup: false,
      groupSize: 0,
      avatarNum,
    })
  }

  batchCount.value = ''
  showBatchModal.value = false
  showToast(`成功添加${count}个好友`)
}

// 确认添加
function confirmAdd() {
  if (chatList.value.length === 0) {
    showToast('请先添加聊天')
    return
  }

  // 添加到store
  const target = addTargets.value[0] || 'chat'
  chatList.value.forEach((item) => {
    if (target === 'chat') {
      // 添加到聊天列表
      const newChat = {
        id: Date.now() + Math.random(),
        name: item.name,
        avatar: item.avatar,
        messages: [],
        unread: 0,
        top: false,
      }
      appStore.chatList.unshift(newChat)
    }
    else {
      // 添加到通讯录
      // 找到最后一个分组添加
      const lastGroup = appStore.contactGroups[appStore.contactGroups.length - 1]
      if (lastGroup) {
        const newIdx = lastGroup.startIdx + lastGroup.list.length
        lastGroup.list.push({
          name: item.name,
          avatarIdx: newIdx,
        })
      }
    }
  })

  showToast(`成功添加${chatList.value.length}个${target === 'chat' ? '聊天' : '联系人'}`)
  chatList.value = []
  showMainModal.value = false
}

// 打开弹窗
function open() {
  showMainModal.value = true
  const newAvatar = getRandomGroupAvatar()
  selectedGroupSize.value = newAvatar.size
  selectedAvatarNum.value = newAvatar.num
}

// 暴露方法
defineExpose({
  open,
})

onMounted(() => {
  // 初始化随机群头像
  const newAvatar = getRandomGroupAvatar()
  selectedGroupSize.value = newAvatar.size
  selectedAvatarNum.value = newAvatar.num
})
</script>

<style scoped>
:deep(.add-chat-modal .van-dialog__content) {
  padding: 0;
}
</style>
