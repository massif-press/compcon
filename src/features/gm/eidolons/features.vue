<template>
  <v-container>persistent traits:</v-container>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'eidolon-builder-content',

  props: {
    item: { type: Object, required: true },
  },
})
</script>
