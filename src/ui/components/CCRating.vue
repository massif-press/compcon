<template>
  <v-rating
    v-model="model"
    hover
    x-large
    :dense="dense"
    :length="max"
    readonly
    :color="color"
    class="d-inline"
    empty-icon="mdi-hexagon-outline"
    full-icon="mdi-hexagon-slice-6"
    background-color="grey lighten-1"
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
    dense: {
      type: Boolean,
      required: false,
    },
    color: {
      type: String,
      required: false,
      default: 'primary'
    },
  },
})
</script>