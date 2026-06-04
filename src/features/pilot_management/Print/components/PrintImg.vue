<template>
  <img v-if="resolvedSrc"
    :src="resolvedSrc"
    alt=""
    :style="cover ? 'width:100%;height:100%;object-fit:cover;display:block' : 'width:100%;display:block'" />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { GetBlob } from '@/io/Storage'

defineOptions({ name: 'PrintImg' })

const props = defineProps<{
  src: string
  cover?: boolean
}>()

const resolvedSrc = ref('')

onMounted(async () => {
  const isRemote = props.src.startsWith('http') || props.src.startsWith('/') || props.src.startsWith('blob:')
  if (isRemote) {
    resolvedSrc.value = props.src
    return
  }
  const blob = await GetBlob('images', props.src)
  if (blob) {
    resolvedSrc.value = URL.createObjectURL(blob)
  } else {
    resolvedSrc.value = props.src
  }
})

onBeforeUnmount(() => {
  if (resolvedSrc.value?.startsWith('blob:')) URL.revokeObjectURL(resolvedSrc.value)
})
</script>
