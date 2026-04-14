<template>
  <div ref="pageRef" class="min-h-100vh bg-[#ededed]">
    <van-nav-bar
      :title="showTop ? '朋友圈' : ''"
      :border="false"
      z-index="999"
      safe-area-inset-top fixed
      :style="{ 'background-color': showTop ? '#fff' : 'transparent', 'border-bottom': showTop ? '1px solid #e5e5e5' : 'none' }"
    >
      <template #left>
        <van-icon name="arrow-left" size="19" :color="showTop ? '#151515' : '#fff'" @click="router.back()" />
      </template>
      <template #right>
        <div
          class="h-22px w-22px"
          :style="{
            background: `url(${getCameraImg(showTop)}) center center / cover no-repeat`,
          }"
          @touchstart="onTouchStart"
          @touchmove="onTouchMove"
          @touchend="onTouchEnd"
        />
      </template>
    </van-nav-bar>
    <div>
      <div class="relative">
        <div
          class="relative h-300px w-full"
          :style="{ background: `url(${userInfo.bgImg}) center center / cover no-repeat` }"
          @click="bgImgShow = true"
        >
          <div class="absolute bottom-0 left-0 right-0 h-50px from-black/15 to-transparent bg-gradient-to-t" />
        </div>
        <div class="absolute bottom-[-10px] right-14px z-10 flex items-center">
          <div class="[text-shadow:0_1px_3px_rgba(0,0,0,0.5)] mr-12px text-17px text-[#fff] font-600">
            {{ userInfo.name }}
          </div>
          <img
            class="h-65px w-65px border-2px border-[#fff] rounded-8px border-solid object-cover"
            :src="userInfo.avatar" alt="头像" @click="router.push('/personCenter')"
          >
        </div>
      </div>

      <div class="bg-[#fff] pt-30px">
        <div
          v-for="item in copyCircleFriendData"
          :id="`list-${item.uuid}`"
          :key="item.uuid"
          class="flex items-start border-b-[0.5px] border-b-[#ededed] border-b-solid px-12px pt-14px"
        >
          <img class="h-40px w-40px shrink-0 rounded-6px object-cover" :src="item.avatar">
          <div class="ml-10px flex-1 pb-14px">
            <div class="text-15px text-[#576b95] font-500 leading-[1.3]">
              {{ item.name }}
            </div>
            <div class="mt-4px break-all text-15px text-[#111] leading-[1.6]" v-html="item.title" />
            <div v-if="item.isLink" class="mt-8px flex items-center rounded-4px bg-[#f5f5f5] p-8px">
              <div
                class="h-42px w-42px shrink-0 rounded-4px"
                :style="{ background: `url(${item.linkImg}) center center / cover no-repeat` }"
              />
              <div class="line-clamp-2 ml-8px text-13px text-[#333] leading-[1.4]">
                {{ item.linkTitle }}
              </div>
            </div>
            <div
              v-else-if="item.img.length"
              class="mt-8px flex flex-wrap gap-4px"
              :class="[item.img.length === 4 ? 'w-168px' : '']"
            >
              <img
                v-if="item.img.length === 1"
                class="max-h-200px max-w-200px rounded-4px object-cover"
                :src="item.img[0]"
                @click="priviewImg(item.img, 0)"
              >
              <template v-else>
                <div
                  v-for="(img, index) in item.img"
                  :key="index"
                  class="h-80px w-80px rounded-4px"
                  :style="{ background: `url(${img}) center center / cover no-repeat` }"
                  @click="priviewImg(item.img, index as number)"
                />
              </template>
            </div>
            <div v-if="item.location" class="mt-6px text-12px text-[#576b95]">
              {{ item.location }}
            </div>
            <div class="relative mt-6px h-30px flex items-center justify-between">
              <div class="flex items-center text-12px text-[#b2b2b2]">
                {{ item.timeAgo }}
                <span v-if="item.isMyActive" class="ml-10px text-13px text-[#576b95]" @click="del(item)">删除</span>
              </div>
              <div
                class="relative h-20px w-22px shrink-0 after:absolute before:absolute after:right-5px after:top-50% before:left-5px before:top-50% after:h-4px after:w-4px before:h-4px before:w-4px after:rounded-full before:rounded-full after:bg-[#576b95] before:bg-[#576b95] after:content-[''] before:content-[''] after:-translate-y-1/2 before:-translate-y-1/2"
                @click.stop="handleAction(item)"
              />
              <div
                v-click-out-side="(e) => tooltipClickOutSide(e, item)"
                class="[transition:width_0.2s_ease] absolute right-30px top-0 h-34px flex items-center overflow-hidden whitespace-nowrap rounded-4px bg-[#4c4c4c]"
                :class="[item.tip ? 'w-200px' : 'w-0']"
              >
                <div class="h-full flex flex-1 items-center justify-center text-14px text-[#fff]" @click.stop="zan(item)">
                  <img class="mr-5px h-16px w-16px" :src="getZanImg(item.isMyZan)">{{ item.isMyZan ? '取消' : '赞' }}
                </div>
                <div class="h-full flex flex-1 items-center justify-center border-l-[0.5px] border-l-[#666] border-l-solid text-14px text-[#fff]" @click.stop="handleComment(item)">
                  <img class="mr-5px h-16px w-16px" src="@/assets/images/icon/comment2.png">评论
                </div>
              </div>
            </div>
            <div
              v-if="item.zan.length || item.msg.length"
              class="relative mt-6px rounded-4px bg-[#f7f7f7] before:absolute before:left-12px before:top-[-8px] before:border-4px before:border-transparent before:border-b-[#f7f7f7] before:border-solid before:content-['']"
            >
              <div
                v-if="item.zan.length"
                class="flex flex-wrap items-center px-8px py-6px"
                :class="[item.zan.length && item.msg.length ? 'border-b-[0.5px] border-b-solid border-b-[#e0e0e0]' : '']"
              >
                <img class="mr-4px h-14px w-14px shrink-0" src="@/assets/images/icon/zan1.png">
                <span v-for="(list, index) in item.zan" :key="index" class="text-13px text-[#576b95] leading-[1.6]">
                  <span v-if="index">,</span> {{ list.name }}
                </span>
              </div>
              <div v-if="item.msg.length" class="px-8px py-6px">
                <div
                  v-for="(msg, index) in item.msg"
                  :key="index"
                  class="flex items-start text-13px leading-[1.6]"
                >
                  <div class="shrink-0 text-[#576b95] font-500">
                    {{ msg.name }}:
                  </div>
                  <div class="ml-2px break-all text-[#333]">
                    {{ msg.title }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <van-image-preview
      v-model:show="show"
      :images="images"
      show-indicators
      :show-index="false"
      :start-position="startPosition"
      :overlay-style="{ 'background-color': '#000000' }"
    />
    <Comment v-if="showComment" v-model="comment" v-click-out-side="clickOutSideFn" @submit="submitFn" />
    <HistoryRecord
      v-model:show="historyShow"
      :list="historyList"
      @del-history="delHistory"
      @edit-history="editHistory"
      @publish-history="publishHistory"
    />
    <van-dialog
      v-model:show="bgImgShow"
      title="修改背景图片"
      show-cancel-button
      :before-close="beforeClose"
      @confirm="confirmFn"
    >
      <van-uploader class="w-full!" :after-read="afterRead">
        <div class="relative h-200px w-full overflow-hidden" :style="{ background: `url(${userInfo.bgImg}) center center / cover no-repeat` }">
          <div class="absolute inset-0 flex items-center justify-center bg-black/30 text-14px text-[#fff]">
            点击这里选择背景图片
          </div>
        </div>
      </van-uploader>
    </van-dialog>
    <!-- 底部安全区 -->
    <div class="van-safe-area-bottom" />
  </div>
</template>

<script setup lang="ts">
import { type Directive, computed, nextTick, onMounted, ref, useTemplateRef, watch } from 'vue'
import { useScroll } from '@vueuse/core'
import { showConfirmDialog, showToast } from 'vant'
import HistoryRecord from './historyRecord.vue'
import Comment from '@/components/Comment.vue'
import { clickOutSide, getDateTimeFormat, setMetaColor } from '@/utils/index'
import IndexDB from '@/utils/indexDB'
import { useAppStore } from '@/store/modules/app'

import camera1 from '@/assets/images/icon/camera1.png'
import camera2 from '@/assets/images/icon/camera2.png'
import zan2 from '@/assets/images/icon/zan2.png'
import zan3 from '@/assets/images/icon/zan3.png'

// 从环境变量获取 IndexDB 配置
const DB_NAME = import.meta.env.VITE_GLOB_INDEXDB_NAME
const STORE_NAME = import.meta.env.VITE_GLOB_INDEXDB_STORE

const getCameraImg = (isTop: boolean) => (isTop ? camera1 : camera2)
const getZanImg = (isMyZan: boolean) => (isMyZan ? zan3 : zan2)

const vClickOutSide = clickOutSide as Directive
const router = useRouter()
const appStore = useAppStore()

// 获取页面根元素，向上查找实际的滚动容器（App.vue 中 overflow-y-auto 的 div）
const pageRef = useTemplateRef<HTMLElement>('pageRef')
const scrollContainer = computed(() => pageRef.value?.parentElement)
const { y: scrollY } = useScroll(scrollContainer)
const showTop = computed(() => scrollY.value >= 145)

const images = ref<string[]>([])
const show = ref(false)
const comment = ref('')
const showComment = ref(false)
const curUuid = ref('')
const historyShow = ref(false)
const db = ref<any>(null)
const historyList = ref<any[]>([])
const startPosition = ref(0)
const bgImgShow = ref(false)
const replaceSoonBgImg = ref('')

const userInfo = computed(() => appStore.userInfo)
const circleFriendData = computed(() => appStore.circleFriendData)

function compareByDate(a: any, b: any) {
  return new Date(b.dateStr).getTime() - new Date(a.dateStr).getTime()
}

// computed 替代 watch + cloneDeep，自动响应数据变化，移除 lodash-es 依赖
const copyCircleFriendData = computed(() =>
  [...circleFriendData.value]
    .filter((item: any) => !item.staticPersonCenter)
    .sort(compareByDate),
)

// 按 uuid 查找指定项
function findItem(uuid: string) {
  return circleFriendData.value.find((item: any) => item.uuid === uuid)
}

// 长按相机图标
let longPressTimer: ReturnType<typeof setTimeout> | null = null
let isLongPress = false

function onTouchStart() {
  isLongPress = false
  longPressTimer = setTimeout(() => {
    isLongPress = true
    historyShow.value = true
  }, 500)
}

function onTouchMove() {
  if (longPressTimer) {
    clearTimeout(longPressTimer)
    longPressTimer = null
  }
}

function onTouchEnd() {
  if (longPressTimer) {
    clearTimeout(longPressTimer)
    longPressTimer = null
  }
  if (!isLongPress) {
    router.push('/publish')
  }
}

// IndexDB 历史记录
async function getAllHistory() {
  const data = await IndexDB.cursorGetData(db.value, STORE_NAME)
  historyList.value = data.sort(compareByDate)
}

async function delHistory(val: any) {
  await IndexDB.deleteDB(db.value, STORE_NAME, val.uuid)
  getAllHistory()
  showToast('删除成功~')
}

function editHistory(val: any) {
  router.push({ path: '/publish', query: { uuid: val.uuid } })
}

function publishHistory(obj: any) {
  if (circleFriendData.value.some((item: any) => item.uuid === obj.uuid)) {
    showToast('已发布朋友圈,如需调整内容, 请编辑~')
    return
  }
  obj.tip = false
  obj.timeAgo = getDateTimeFormat(obj.dateStr)
  appStore.pushCircleFriendData(obj)
  appStore.setUserInfo({ avatar: obj.avatar, name: obj.name })
  historyShow.value = false
  nextTick(() => {
    document.querySelector(`#list-${obj.uuid}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
  })
}

// 图片预览
function priviewImg(imgs: string[], i: number) {
  images.value = imgs
  startPosition.value = i
  show.value = true
}

// 操作交互
function handleAction(obj: any) {
  circleFriendData.value.forEach((item: any) => {
    item.tip = item.uuid === obj.uuid ? !item.tip : false
  })
}

function handleComment(obj: any) {
  showComment.value = true
  obj.tip = false
  curUuid.value = obj.uuid
}

function zan(obj: any) {
  const item = findItem(obj.uuid)
  if (!item) {
    return
  }
  const zanIndex = item.zan.findIndex((i: any) => i.name === userInfo.value.name)
  zanIndex !== -1
    ? item.zan.splice(zanIndex, 1)
    : item.zan.push({ name: userInfo.value.name, img: userInfo.value.avatar })
  item.tip = false
  item.isMyZan = !item.isMyZan
}

function submitFn() {
  const item = findItem(curUuid.value)
  if (item) {
    item.msg.push({ name: userInfo.value.name, img: userInfo.value.avatar, title: comment.value })
  }
  showComment.value = false
}

function del(obj: any) {
  showConfirmDialog({ message: '删除朋友圈?' })
    .then(() => {
      const index = circleFriendData.value.findIndex((i: any) => i.uuid === obj.uuid)
      if (index !== -1) {
        circleFriendData.value.splice(index, 1)
      }
    })
    .catch(() => {})
}

// 点击外部
function clickOutSideFn(e: MouseEvent) {
  if (!(e.target as HTMLElement).classList.contains('comment')) {
    showComment.value = false
  }
}

function tooltipClickOutSide(e: MouseEvent, obj: any) {
  if (!(e.target as HTMLElement).classList.contains('tooltip')) {
    const item = findItem(obj.uuid)
    if (item) {
      item.tip = false
    }
  }
}

// 背景图片
function afterRead(e: any) {
  replaceSoonBgImg.value = e.content
  appStore.setUserInfo({ bgImg: e.content })
}

function confirmFn() {
  bgImgShow.value = true
}

function beforeClose(action: string): boolean {
  if (action !== 'confirm') {
    return true
  }
  if (!replaceSoonBgImg.value) {
    showToast('请先选择需要替换的图片')
    return false
  }
  appStore.setUserInfo({ bgImg: replaceSoonBgImg.value })
  replaceSoonBgImg.value = ''
  return true
}

// 图片预览切换主题色
watch(show, val => setMetaColor(val ? '#000' : '#ededed'))

onMounted(async () => {
  try {
    // 尝试打开数据库，如果存储不存在会增加版本号重新创建
    db.value = await IndexDB.openDB(DB_NAME, STORE_NAME, 1)
    getAllHistory()
  }
  catch (error) {
    console.error('IndexDB 初始化失败:', error)
    // 如果失败，尝试删除旧数据库重新创建
    await IndexDB.deleteDBAll(DB_NAME)
    db.value = await IndexDB.openDB(DB_NAME, STORE_NAME, 1)
    getAllHistory()
  }
})
</script>

<style lang="less" scoped>
.van-uploader {
  :deep(.van-uploader__wrapper),
  :deep(.van-uploader__input-wrapper) {
    width: 100%;
  }
}
</style>
