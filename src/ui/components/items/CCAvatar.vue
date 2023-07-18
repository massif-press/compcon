<template>
  <preview :width="size" :height="size" :image="avatar.image" :coordinates="avatar.coordinates" />
</template>

<script lang="ts">
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
      default: 200,
    },
  },
};
</script>
