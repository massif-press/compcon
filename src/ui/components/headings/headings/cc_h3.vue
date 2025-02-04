<template>
  <div class="text-uppercase" :class="[center && 'text-center', color && `text-${color}`]">
    <b :style="!dense && 'letter-spacing: 5px'"><slot /></b>
  </div>
</template>

<script lang="ts">
export default {
  name: 'cc-h3',
  props: {
    color: { type: String },
    dense: { type: Boolean, default: false },
    center: { type: Boolean, default: false },
  },
};
</script>
