<template>
  <v-layout class="my-2">
    <cc-tag v-for="(t, i) in tags" :key="`${t.id}_${i}`" :tag="t" />
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'cc-tags',
  props: {
    tags: {
      type: Array,
      required: true,
    },
  },
})
</script>