<template>
  <span :style="size ? `font-size:${size}pt;` : ``" class="panel-border--text">//</span>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'cc-slashes',
  props: {
    size: {
      type: [String, Number],
      required: false,
      default: '',
    },
  },
})
</script>
