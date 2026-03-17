<template>
  <div
    v-if="width"
    :style="`height: ${height}px; width: ${width}px; border-bottom: 1px solid rgba(0,0,0,0.25); border-radius: 0;`"
  />
  <div
    v-else
    :style="`height: ${height}px; width: 100%; border-bottom: 1px solid rgba(0,0,0,0.25); border-radius: 0;`"
  />
</template>

<script lang="ts">
export default {
  name: 'terse-print',
  props: {
    height: {
      type: Number,
      required: true,
    },
    width: {
      type: Number,
      required: false,
    },
    inline: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
};
</script>
