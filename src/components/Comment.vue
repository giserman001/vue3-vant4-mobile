<template>
  <div class="comment-bar fixed bottom-0 left-0 right-0 z-999 flex items-center bg-white px-12px py-8px" style="box-shadow: 0 -1px 6px rgba(0,0,0,0.08);">
    <input
      v-model="inputVal"
      class="h-36px flex-1 rounded-4px border-none bg-#f5f5f5 px-12px text-14px outline-none"
      type="text"
      placeholder="评论"
      @keyup.enter="submit"
    >
    <div
      class="ml-10px h-36px flex-shrink-0 rounded-4px bg-#07c160 px-16px text-14px text-white leading-36px"
      @click="submit"
    >
      发送
    </div>
  </div>
</template>

<script setup lang="ts">
import { useVModel } from '@vueuse/core'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'submit'): void
}>()

const inputVal = useVModel(props, 'modelValue', emit)

function submit() {
  if (!inputVal.value.trim()) {
    return
  }
  emit('submit')
}
</script>
