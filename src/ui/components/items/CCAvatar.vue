<template>
  <preview
    :width="Number(size)"
    :height="Number(size)"
    :image="avatar.image"
    :coordinates="avatar.coordinates"
  />
</template>

<script setup lang="ts">
  import { Preview } from 'vue-advanced-cropper'

  withDefaults(
    defineProps<{
      avatar: { image: { src: string }; coordinates: any }
      size?: number | string
    }>(),
    {
      size: 200,
    }
  )
</script>
