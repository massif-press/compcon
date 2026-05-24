<template>
  <preview :width="Number(size)" :height="Number(size)" :image="avatar.image" :coordinates="avatar.coordinates" />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { GetBlob } from '@/io/Storage';
import { Preview } from 'vue-advanced-cropper';

const props = withDefaults(defineProps<{
  avatar: object
  size?: number | string
}>(), {
  size: 200,
})

onMounted(async () => {
  if (props.avatar.image.src.startsWith('http')) return;
  if (!props.avatar.image.src.startsWith('blob')) {
    const blob = await GetBlob('images', props.avatar.image.src);
    props.avatar.image.src = URL.createObjectURL(blob);
  }
})
</script>
