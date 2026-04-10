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

// 聊天消息
export interface ChatMessage {
  content: string
  isFriend: boolean
  time: string
  showTime: boolean
}

// 聊天列表项
export interface ChatListItem {
  id: number
  name: string
  avatar: string
  messages: ChatMessage[]
  unread: number
  top: boolean
}

// 自己头像
const selfAvatar = '/src/assets/images/head-portrait/21.jpg'

// 生成聊天数据的辅助函数
function generateChatMessages(friendName: string, _friendAvatar: string): ChatMessage[] {
  const now = new Date()
  const today = `${now.getMonth() + 1}月${now.getDate()}日`

  // 根据好友名称生成不同的对话内容
  const conversations: Record<string, ChatMessage[]> = {
    '热心网友': [
      { content: '你好，请问这个框架支持 TypeScript 吗？', isFriend: true, time: `${today} 09:15`, showTime: true },
      { content: '支持的，完全基于 TypeScript 开发', isFriend: false, time: `${today} 09:16`, showTime: false },
      { content: '太好了，那我准备开始使用了', isFriend: true, time: `${today} 09:18`, showTime: false },
      { content: '使用说明和打赏功能在下面的发现页面哦。', isFriend: false, time: `${today} 09:20`, showTime: false },
      { content: '好的，我去看看', isFriend: true, time: `${today} 09:22`, showTime: false },
      { content: '有问题随时问我', isFriend: false, time: `${today} 09:25`, showTime: false },
    ],
    '李伟': [
      { content: '今晚有空吗？', isFriend: true, time: `${today} 08:30`, showTime: true },
      { content: '有啊，怎么了？', isFriend: false, time: `${today} 08:35`, showTime: false },
      { content: '8点钟，有骨气，一起吃个饭', isFriend: true, time: `${today} 08:51`, showTime: false },
      { content: '好嘞，准时到', isFriend: false, time: `${today} 08:52`, showTime: false },
      { content: '记得带酒', isFriend: true, time: `${today} 08:53`, showTime: false },
      { content: '没问题，我带两瓶好的', isFriend: false, time: `${today} 08:55`, showTime: false },
    ],
    '小兔乖乖': [
      { content: '文件已经发过去了，请查收', isFriend: true, time: `${today} 07:23`, showTime: true },
      { content: '好的，收到了，谢谢！', isFriend: false, time: `${today} 07:25`, showTime: false },
      { content: '你看一下有没有问题', isFriend: true, time: `${today} 07:26`, showTime: false },
      { content: '正在看，稍等', isFriend: false, time: `${today} 07:30`, showTime: false },
      { content: '没问题，做得很好', isFriend: false, time: `${today} 07:35`, showTime: false },
      { content: '那就好，有问题随时找我', isFriend: true, time: `${today} 07:36`, showTime: false },
    ],
    '李建明': [
      { content: '明天8点，不见不散！', isFriend: true, time: `${today} 07:20`, showTime: true },
      { content: '好的，一定准时到', isFriend: false, time: `${today} 07:22`, showTime: false },
      { content: '记得带身份证', isFriend: true, time: `${today} 07:23`, showTime: false },
      { content: '好的，还有别的要带吗？', isFriend: false, time: `${today} 07:24`, showTime: false },
      { content: '不用了，人到就行', isFriend: true, time: `${today} 07:25`, showTime: false },
    ],
    '丽丽': [
      { content: '你好啊，在忙吗？', isFriend: true, time: `${today} 06:20`, showTime: true },
      { content: '还好，有什么事吗？', isFriend: false, time: `${today} 06:22`, showTime: false },
      { content: '周末有空一起去逛街吗？', isFriend: true, time: `${today} 06:23`, showTime: false },
      { content: '可以啊，想去哪里？', isFriend: false, time: `${today} 06:25`, showTime: false },
      { content: '去万象城吧，听说新开了一家奶茶店', isFriend: true, time: `${today} 06:26`, showTime: false },
      { content: '好啊，我请你喝', isFriend: false, time: `${today} 06:28`, showTime: false },
    ],
    '王陵（北京顾客）': [
      { content: '借我一点钱，明天就还你', isFriend: true, time: '昨天 20:20', showTime: true },
      { content: '多少？', isFriend: false, time: '昨天 20:25', showTime: false },
      { content: '5000，急用', isFriend: true, time: '昨天 20:26', showTime: false },
      { content: '转账过去了，记得还啊', isFriend: false, time: '昨天 20:30', showTime: false },
      { content: '放心，明天一定还', isFriend: true, time: '昨天 20:31', showTime: false },
      { content: '好的', isFriend: false, time: '昨天 20:32', showTime: false },
    ],
    '王小军': [
      { content: '呵呵~~~~', isFriend: true, time: '昨天 19:20', showTime: true },
      { content: '什么意思？', isFriend: false, time: '昨天 19:22', showTime: false },
      { content: '没什么', isFriend: true, time: '昨天 19:23', showTime: false },
      { content: '有事直说', isFriend: false, time: '昨天 19:25', showTime: false },
      { content: '真没事', isFriend: true, time: '昨天 19:26', showTime: false },
    ],
    '郑有海': [
      { content: '[转账]您有一笔转账', isFriend: true, time: '昨天 18:23', showTime: true },
      { content: '收到了，谢谢！', isFriend: false, time: '昨天 18:25', showTime: false },
      { content: '这是上个月的货款', isFriend: true, time: '昨天 18:26', showTime: false },
      { content: '好的，合作愉快', isFriend: false, time: '昨天 18:28', showTime: false },
      { content: '下个月继续', isFriend: true, time: '昨天 18:30', showTime: false },
    ],
    '询价-刘经理': [
      { content: '[图片]', isFriend: true, time: '昨天 15:20', showTime: true },
      { content: '看到了，这个多少钱？', isFriend: false, time: '昨天 15:25', showTime: false },
      { content: '这个型号的价格是 2999', isFriend: true, time: '昨天 15:26', showTime: false },
      { content: '能便宜点吗？', isFriend: false, time: '昨天 15:28', showTime: false },
      { content: '量大从优，10台以上可以打9折', isFriend: true, time: '昨天 15:30', showTime: false },
      { content: '我先考虑一下', isFriend: false, time: '昨天 15:35', showTime: false },
    ],
    'Sina': [
      { content: '照片我已经发过去了', isFriend: true, time: '昨天 13:56', showTime: true },
      { content: '看到了，拍得很好', isFriend: false, time: '昨天 14:00', showTime: false },
      { content: '谢谢夸奖', isFriend: true, time: '昨天 14:01', showTime: false },
      { content: '下次一起去拍照吧', isFriend: false, time: '昨天 14:05', showTime: false },
      { content: '好啊，什么时候？', isFriend: true, time: '昨天 14:06', showTime: false },
      { content: '这周末怎么样？', isFriend: false, time: '昨天 14:10', showTime: false },
    ],
    '路飞': [
      { content: '为什么不回信息', isFriend: true, time: '昨天 13:34', showTime: true },
      { content: '刚才在忙，不好意思', isFriend: false, time: '昨天 13:40', showTime: false },
      { content: '忙什么？', isFriend: true, time: '昨天 13:41', showTime: false },
      { content: '开会呢', isFriend: false, time: '昨天 13:45', showTime: false },
      { content: '开完会了吗？', isFriend: true, time: '昨天 14:00', showTime: false },
      { content: '开完了，有什么事？', isFriend: false, time: '昨天 14:05', showTime: false },
    ],
    '渠道推荐16655665148': [
      { content: '[文件]2022年价格表', isFriend: true, time: '昨天 12:20', showTime: true },
      { content: '收到了，谢谢', isFriend: false, time: '昨天 12:25', showTime: false },
      { content: '你看一下，有问题问我', isFriend: true, time: '昨天 12:26', showTime: false },
      { content: '好的，我看一下', isFriend: false, time: '昨天 12:30', showTime: false },
      { content: '价格还能再优惠吗？', isFriend: false, time: '昨天 13:00', showTime: false },
      { content: '量大可以谈', isFriend: true, time: '昨天 13:05', showTime: false },
    ],
    'Nothing': [
      { content: '[ok]谢谢', isFriend: true, time: '昨天 11:20', showTime: true },
      { content: '不客气', isFriend: false, time: '昨天 11:21', showTime: false },
      { content: '下次有问题再找你', isFriend: true, time: '昨天 11:22', showTime: false },
      { content: '好的，随时欢迎', isFriend: false, time: '昨天 11:25', showTime: false },
    ],
    'AA空气炮': [
      { content: '感谢您的信任与支持', isFriend: true, time: '昨天 10:11', showTime: true },
      { content: '客气了，服务很好', isFriend: false, time: '昨天 10:15', showTime: false },
      { content: '有需要随时联系我们', isFriend: true, time: '昨天 10:16', showTime: false },
      { content: '好的，一定会的', isFriend: false, time: '昨天 10:20', showTime: false },
    ],
    '戴剑敏': [
      { content: '。。。。。。。。', isFriend: true, time: '昨天 10:10', showTime: true },
      { content: '怎么了？', isFriend: false, time: '昨天 10:12', showTime: false },
      { content: '没事', isFriend: true, time: '昨天 10:13', showTime: false },
      { content: '真的没事？', isFriend: false, time: '昨天 10:15', showTime: false },
      { content: '嗯', isFriend: true, time: '昨天 10:16', showTime: false },
    ],
    '胡伟立': [
      { content: '[语音通话]', isFriend: true, time: '昨天 09:20', showTime: true },
      { content: '刚才没接到，什么事？', isFriend: false, time: '昨天 09:25', showTime: false },
      { content: '晚上一起吃饭', isFriend: true, time: '昨天 09:26', showTime: false },
      { content: '好啊，几点？', isFriend: false, time: '昨天 09:30', showTime: false },
      { content: '7点，老地方', isFriend: true, time: '昨天 09:31', showTime: false },
      { content: 'OK', isFriend: false, time: '昨天 09:32', showTime: false },
    ],
    '小阿飞': [
      { content: '我喜欢你', isFriend: true, time: '昨天 08:20', showTime: true },
      { content: '谢谢，但是我们不合适', isFriend: false, time: '昨天 08:30', showTime: false },
      { content: '为什么？', isFriend: true, time: '昨天 08:31', showTime: false },
      { content: '我有喜欢的人了', isFriend: false, time: '昨天 08:35', showTime: false },
      { content: '好吧，祝你们幸福', isFriend: true, time: '昨天 08:36', showTime: false },
      { content: '谢谢', isFriend: false, time: '昨天 08:37', showTime: false },
    ],
    '丁锦': [
      { content: '帮我一个忙，改天请你吃饭啊', isFriend: true, time: '昨天 08:10', showTime: true },
      { content: '什么忙？', isFriend: false, time: '昨天 08:15', showTime: false },
      { content: '帮我搬家', isFriend: true, time: '昨天 08:16', showTime: false },
      { content: '什么时候？', isFriend: false, time: '昨天 08:18', showTime: false },
      { content: '这周六', isFriend: true, time: '昨天 08:19', showTime: false },
      { content: '可以，几点？', isFriend: false, time: '昨天 08:20', showTime: false },
    ],
    '罗心悦': [
      { content: '帮我朋友圈点个赞谢谢', isFriend: true, time: '昨天 07:20', showTime: true },
      { content: '好的，已赞', isFriend: false, time: '昨天 07:25', showTime: false },
      { content: '谢谢', isFriend: true, time: '昨天 07:26', showTime: false },
      { content: '不客气', isFriend: false, time: '昨天 07:27', showTime: false },
      { content: '下次也帮我赞', isFriend: false, time: '昨天 07:28', showTime: false },
      { content: '没问题', isFriend: true, time: '昨天 07:30', showTime: false },
    ],
    '英卫小公主': [
      { content: '你昨天去哪里了？', isFriend: true, time: '昨天 07:10', showTime: true },
      { content: '在家休息呢', isFriend: false, time: '昨天 07:15', showTime: false },
      { content: '怎么不找我玩', isFriend: true, time: '昨天 07:16', showTime: false },
      { content: '太累了，想睡觉', isFriend: false, time: '昨天 07:18', showTime: false },
      { content: '那今天呢？', isFriend: true, time: '昨天 07:19', showTime: false },
      { content: '今天可以，你想去哪？', isFriend: false, time: '昨天 07:20', showTime: false },
    ],
  }

  return conversations[friendName] || [
    { content: '你好', isFriend: true, time: `${today} 09:00`, showTime: true },
    { content: '你好', isFriend: false, time: `${today} 09:01`, showTime: false },
  ]
}

// 通讯录联系人接口
export interface ContactItem {
  name: string
  avatarIdx: number
}

// 通讯录分组接口
export interface ContactGroup {
  letter: string
  startIdx: number
  list: ContactItem[]
}

// 初始化通讯录数据
function initContactGroups(): ContactGroup[] {
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
  let avatarIdx = 1
  return contactGroupsRaw.map(group => ({
    ...group,
    startIdx: avatarIdx,
    list: group.list.map((item, idx) => ({
      ...item,
      avatarIdx: avatarIdx + idx,
    })),
    _endIdx: (avatarIdx += group.list.length),
  })) as ContactGroup[]
}

// 初始化聊天列表数据
function initChatList(): ChatListItem[] {
  const names = [
    '热心网友',
    '李伟',
    '小兔乖乖',
    '李建明',
    '丽丽',
    '王陵（北京顾客）',
    '王小军',
    '郑有海',
    '询价-刘经理',
    'Sina',
    '路飞',
    '渠道推荐16655665148',
    'Nothing',
    'AA空气炮',
    '戴剑敏',
    '胡伟立',
    '小阿飞',
    '丁锦',
    '罗心悦',
    '英卫小公主',
  ]

  return names.map((name, index) => {
    const avatar = `/src/assets/images/head-portrait/${index + 1}.jpg`
    const messages = generateChatMessages(name, avatar)

    return {
      id: index + 1,
      name,
      avatar,
      messages,
      unread: index < 3 ? [2, 0, 10][index] : 0, // 前3个有未读
      top: index < 2, // 前2个置顶
    }
  })
}

export const useAppStore = defineStore('app', () => {
  // State
  const needAnimate = ref(false)
  const directionName = ref('') // 页面切换方向：slide-left左滑前进，slide-right右滑后退
  // 个人用户数据
  const userInfo = ref<UserInfo>({
    avatar: Avatar,
    name: '一生有你',
    wxNumber: 'wxid_take8865nm568',
    local: '安道尔',
    gender: 1,
    bgImg,
  })
  // 朋友圈数据
  const circleFriendData = ref(processedCircleFriendData)
  // 聊天列表数据
  const chatList = ref<ChatListItem[]>(initChatList())
  // 通讯录数据
  const contactGroups = ref<ContactGroup[]>(initContactGroups())

  // Getters
  const getNeedAnimate = computed(() => needAnimate.value)
  const getDirectionName = computed(() => directionName.value)
  const getUserInfo = computed(() => userInfo.value)
  const getChatList = computed(() => chatList.value)

  // 获取最后一条消息
  const getLastMessage = (id: number) => {
    const chat = chatList.value.find(item => item.id === id)
    return chat?.messages[chat.messages.length - 1]
  }

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

  // 删除聊天
  const deleteChat = (id: number) => {
    const index = chatList.value.findIndex(item => item.id === id)
    if (index > -1) {
      chatList.value.splice(index, 1)
    }
  }

  // 设置未读数
  const setUnread = (id: number, count: number) => {
    const chat = chatList.value.find(item => item.id === id)
    if (chat) {
      chat.unread = count
    }
  }

  // 清空未读
  const clearUnread = (id: number) => {
    const chat = chatList.value.find(item => item.id === id)
    if (chat) {
      chat.unread = 0
    }
  }

  // 发送消息
  const sendMessage = (id: number, content: string, isFriend: boolean) => {
    const chat = chatList.value.find(item => item.id === id)
    if (!chat) {
      return
    }

    const now = new Date()
    const timeStr = `${now.getMonth() + 1}月${now.getDate()}日 ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`

    chat.messages.push({
      content,
      isFriend,
      time: timeStr,
      showTime: true,
    })

    // 如果是好友发送的消息，增加未读数
    if (isFriend) {
      chat.unread++
    }
  }

  // 切换置顶
  const toggleTop = (id: number) => {
    const chat = chatList.value.find(item => item.id === id)
    if (chat) {
      chat.top = !chat.top
      // 重新排序：置顶的在前
      chatList.value.sort((a, b) => (b.top ? 1 : 0) - (a.top ? 1 : 0))
    }
  }

  return {
    needAnimate,
    directionName,
    userInfo,
    circleFriendData,
    chatList,
    selfAvatar,
    getNeedAnimate,
    getDirectionName,
    getUserInfo,
    getChatList,
    getLastMessage,
    contactGroups,
    setNeedAnimate,
    setUserInfo,
    setDirectionName,
    pushCircleFriendData,
    deleteChat,
    setUnread,
    clearUnread,
    sendMessage,
    toggleTop,
  }
})
