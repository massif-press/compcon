<template>
  <v-row class="my-2">
    <cc-tag v-for="(t, i) in tags" :key="`${t.id}_${i}`" :tag="t" :small="small" :color="color" />
  </v-row>
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
    small: {
      type: Boolean,
      required: false,
    },
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
  },
})
</script>
