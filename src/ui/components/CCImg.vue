<template>
  <v-img
    v-if="!loadFailed"
    :key="src"
    :src="image"
    :cover="cover"
    :aspect-ratio="aspectRatio"
    :position="position"
    :height="height"
    :max-width="maxWidth"
    :min-width="minWidth"
    :max-height="maxHeight"
    :min-height="minHeight"
    :contain="contain"
    @error="handleImageError"
  >
    <slot />
  </v-img>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue'

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
    fallbackSrc?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    fallbackSrc: '',
  })

  const imageUrl = ref(props.src)
  const loadFailed = ref(false)

  const image = computed(() => imageUrl.value)

  watch(
    () => props.src,
    newVal => {
      imageUrl.value = newVal
      loadFailed.value = false
    }
  )

  function handleImageError() {
    if (props.fallbackSrc && imageUrl.value !== props.fallbackSrc) {
      imageUrl.value = props.fallbackSrc
      return
    }
    loadFailed.value = true
  }
</script>
