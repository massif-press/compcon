<template>
  <preview :width="size" :height="size" :image="avatar.image" :coordinates="avatar.coordinates" />
</template>

<script lang="ts">
import { GetBlob } from '@/io/Storage';
import { Preview } from 'vue-advanced-cropper';

export default {
  name: 'cc-avatar',
  components: {
    Preview,
  },
  props: {
    avatar: {
      type: Object,
      required: true,
    },
    size: {
      type: Number,
      required: false,
      default: 200,
    },
  },
  async created() {
    if (this.avatar.image.src.startsWith('http')) return;
    if (!this.avatar.image.src.startsWith('blob')) {
      const blob = await GetBlob('images', this.avatar.image.src);
      this.avatar.image.src = URL.createObjectURL(blob);
    }
  },
};
</script>
