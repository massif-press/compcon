<template>
  <span>dynamic loader for system, trait, feature</span>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'npc-feature-card',
  props: {
    feature: {
      type: Object,
      required: true,
    },
  },
})
</script>
