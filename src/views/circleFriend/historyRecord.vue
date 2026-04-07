<template>
  <van-action-sheet :show="show" title="历史记录" :closeable="false" @click-overlay="close">
    <div class="max-h-[50vh] min-h-[10vh] overflow-y-auto p-30px">
      <template v-if="list.length">
        <div
          v-for="item in list"
          :key="item.uuid"
          class="mb-10px flex items-center rounded-25px bg-[#f8f8f8] p-20px last:mb-0"
        >
          <div class="flex-1 truncate text-28px text-[#000]">
            {{ item.title || item.linkTitle || item.name }}
          </div>
          <div class="flex shrink-0 items-center">
            <div class="mr-10px shrink-0 text-[#1989fa]" @click="publishHistory(item)">
              发布
            </div>
            <div class="mr-10px shrink-0 text-[#07c160]" @click="editHistory(item)">
              编辑
            </div>
            <div class="shrink-0 text-[#ee0a24]" @click="delHistory(item)">
              删除
            </div>
          </div>
        </div>
      </template>
      <van-empty v-else description="暂无历史记录~" />
    </div>
  </van-action-sheet>
</template>

<script setup lang="ts">
import { showConfirmDialog } from 'vant'

interface HistoryItem {
  uuid: string
  title?: string
  linkTitle?: string
  name?: string
  [key: string]: any
}

defineProps<{
  show: boolean
  list: HistoryItem[]
}>()

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
  (e: 'delHistory', item: HistoryItem): void
  (e: 'editHistory', item: HistoryItem): void
  (e: 'publishHistory', item: HistoryItem): void
}>()

function close() {
  emit('update:show', false)
}

function delHistory(obj: HistoryItem) {
  showConfirmDialog({
    message: '删除这条历史记录?',
  })
    .then(() => {
      emit('delHistory', obj)
    })
    .catch(() => {})
}

function editHistory(obj: HistoryItem) {
  emit('editHistory', obj)
}

function publishHistory(obj: HistoryItem) {
  emit('publishHistory', obj)
}
</script>

<style lang="less" scoped>
</style>
