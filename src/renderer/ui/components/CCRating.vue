<template>
  <v-rating
    v-model="model"
    hover
    x-large
    :length="max"
    readonly
    class="d-inline"
    empty-icon="mdi-hexagon-outline"
    full-icon="mdi-hexagon-slice-6"
  />
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'cc-ranking',
  props: {
    model: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      required: false,
      default: 6,
    },
  },
})
</script>