<template>
  <cc-item-card :item="item" />
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'integrated-info-base',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
})
</script>
