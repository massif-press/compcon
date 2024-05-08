<template>
  <div
    v-if="width"
    :style="`height: ${height}px; width: ${width}px;  background-color: rgba(0,0,0,0.075); border-radius: 3px; `"
  />
  <div
    v-else
    :style="`height: ${height}px; width: 100%;  background-color: rgba(0,0,0,0.075); border-radius: 3px; `"
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
