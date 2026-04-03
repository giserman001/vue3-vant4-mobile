import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import circleFriendData from '@/data/circleFriendData'
import Avatar from '@/assets/images/head-portrait/my/1.jpg'
import bgImg from '@/assets/images/bg.jpg'

// 处理朋友圈数据 - 添加 tip 字段
const processedCircleFriendData = circleFriendData.map((item: any) => ({
  ...item,
  tip: false,
}))

export interface UserInfo {
  avatar: string
  name: string
  wxNumber: string
  local: string
  gender: number
  bgImg: string
}

export const useAppStore = defineStore('app', () => {
  // State
  const needAnimate = ref(false)
  const directionName = ref('') // 页面切换方向：slide-left左滑前进，slide-right右滑后退
  const userInfo = ref<UserInfo>({
    avatar: Avatar,
    name: '一生有你',
    wxNumber: 'wxid_take8865nm568',
    local: '安道尔',
    gender: 1,
    bgImg,
  })
  const circleFriendData = ref(processedCircleFriendData)

  // Getters
  const getNeedAnimate = computed(() => needAnimate.value)
  const getDirectionName = computed(() => directionName.value)
  const getUserInfo = computed(() => userInfo.value)

  // Actions
  const setNeedAnimate = (val: boolean) => {
    needAnimate.value = val
  }

  const setUserInfo = (info: Partial<UserInfo>) => {
    userInfo.value = { ...userInfo.value, ...info }
  }

  const setDirectionName = (val: string) => {
    directionName.value = val
  }

  const pushCircleFriendData = (val: any) => {
    circleFriendData.value.push(val)
  }

  return {
    needAnimate,
    directionName,
    userInfo,
    circleFriendData,
    getNeedAnimate,
    getDirectionName,
    getUserInfo,
    setNeedAnimate,
    setUserInfo,
    setDirectionName,
    pushCircleFriendData,
  }
})
