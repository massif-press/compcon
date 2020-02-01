<template>
  <v-alert dense :color="color" border="left" outlined>
    <h3 class="heading" :style="`color: ${color}`">{{ trait.name }}</h3>
    <span class="body-text text--text">{{ trait.description }}</span>
  </v-alert>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'cc-trait-item',
  props: {
    trait: {
      type: Object,
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
  },
})
</script>
