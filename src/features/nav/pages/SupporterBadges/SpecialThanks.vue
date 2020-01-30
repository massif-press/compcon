<template>
  <v-chip outlined label class="ma-1">{{ name }}</v-chip>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'special-thanks-badge',
  props: {
    name: {
      type: String,
      required: true,
    },
  },
})
</script>
