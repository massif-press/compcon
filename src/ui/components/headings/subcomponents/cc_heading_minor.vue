<template>
  <div class="text-overline" :style="`${short ? 'line-height: 1.2' : ''}`"><slot /></div>
</template>

<script lang="ts">
export default {
  name: 'cc-title',
  props: {
    color: { type: String, default: 'primary' },
    short: { type: Boolean, default: false },
  },
};
</script>
