<template>
  <v-img
    v-if="!loadFailed"
    :src="image"
    :key="src"
    @error="handleImageError"
    :cover="cover"
    :aspect-ratio="aspectRatio"
    :position="position"
    :height="height"
    :max-width="maxWidth"
    :min-width="minWidth"
    :max-height="maxHeight"
    :min-height="minHeight"
    :contain="contain"
    :style="style">
    <slot />
  </v-img>
</template>

<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { GetBlob } from '@/io/Storage'

interface Props {
  src: string
  cover?: boolean
  aspectRatio?: string | number
  position?: string
  height?: string | number
  maxWidth?: string | number
  minWidth?: string | number
  maxHeight?: string | number
  minHeight?: string | number
  contain?: boolean
  style?: string
  fallbackSrc?: string
}

const props = withDefaults(defineProps<Props>(), {
  fallbackSrc: '',
})

const imageUrl = ref(props.src)
const loadFailed = ref(false)

const image = computed(() => imageUrl.value)

watch(() => props.src, (newVal) => {
  if (imageUrl.value?.startsWith('blob:')) URL.revokeObjectURL(imageUrl.value)
  imageUrl.value = newVal
  loadFailed.value = false
})

onBeforeUnmount(() => {
  if (imageUrl.value?.startsWith('blob:')) URL.revokeObjectURL(imageUrl.value)
})

async function handleImageError() {
  const isRemoteUrl =
    props.src.startsWith('http') || props.src.startsWith('/') || props.src.startsWith('blob:')
  if (!isRemoteUrl) {
    const blob = await GetBlob('images', props.src)
    if (blob) {
      imageUrl.value = URL.createObjectURL(blob)
      return
    }
  }
  if (props.fallbackSrc && imageUrl.value !== props.fallbackSrc) {
    imageUrl.value = props.fallbackSrc
    return
  }
  loadFailed.value = true
}
</script>
