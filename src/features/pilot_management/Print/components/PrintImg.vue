<template>
  <img
    v-if="src"
    :src="src"
    alt=""
    :style="
      cover ? 'width:100%;height:100%;object-fit:cover;display:block' : 'width:100%;display:block'
    "
  />
</template>

<script setup lang="ts">
  defineOptions({ name: 'PrintImg' })

  defineProps<{
    src: string
    cover?: boolean
  }>()
</script>
