<template>
  <v-flex>
    <v-card flat tile color="panel" class="text-center" width="100%" style="min-width: 10vw">
      <v-card-title class="heading h3 primary--text px-3 py-0 mx-0 my-1">{{name}}</v-card-title>
      <v-card-text class="stat-text x-large-text text--text px-2 ma-0 mt-2">{{value}}</v-card-text>
    </v-card>
  </v-flex>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'cc-statblock-panel',
  props: {
    name: {
      type: String,
      required: true,
    },
    value: {
      type: [String, Number],
      required: true,
    },
  },
})
</script>