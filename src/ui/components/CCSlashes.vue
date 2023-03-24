<template>
  <span :style="`opacity: 0.5; ${size ? `font-size:${size}pt;` : ``}`">//</span>
</template>

<script lang="ts">
export default {
  name: 'CCSlashes',
  props: {
    size: {
      type: [String, Number],
      required: false,
      default: '',
    },
  },
};
</script>
