<template>
  <preview
    :width="Number(size)"
    :height="Number(size)"
    :image="image"
    :coordinates="avatar.coordinates"
  />
</template>

<script setup lang="ts">
  import { computed, onBeforeUnmount, ref, watch } from 'vue'
  import { GetBlob } from '@/io/Storage'
  import { Preview } from 'vue-advanced-cropper'

  const props = withDefaults(
    defineProps<{
      avatar: { image: { src: string }; coordinates: any }
      size?: number | string
    }>(),
    {
      size: 200,
    }
  )

  const src = ref('')
  const image = computed(() => ({ ...props.avatar.image, src: src.value }))

  let mounted = true
  let latestResolveId = 0

  function revokeCurrentObjectUrl() {
    if (src.value?.startsWith('blob:')) URL.revokeObjectURL(src.value)
  }

  async function resolve(key: string) {
    const resolveId = ++latestResolveId
    revokeCurrentObjectUrl()
    src.value = key
    if (!key || /^(https?|blob|data):/.test(key)) return
    const blob = await GetBlob('images', key)
    const stillWanted = mounted && resolveId === latestResolveId
    if (!blob || !stillWanted) return
    src.value = URL.createObjectURL(blob as Blob)
  }

  watch(() => props.avatar.image.src, resolve, { immediate: true })

  onBeforeUnmount(() => {
    mounted = false
    revokeCurrentObjectUrl()
  })
</script>
