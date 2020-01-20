<template>
  <v-col>
    <v-card
      flat
      tile
      color="light-panel"
      class="text-center"
      height="100%"
      width="100%"
      style="min-width: 15vw"
    >
      <v-card-title class="heading h3 primary px-3 py-0 ma-0">
        <span class="white--text">{{ name }}</span>
      </v-card-title>
      <v-card-text class="heading x-large-text text--text px-2 ma-0 mt-1 mb-0">
        <span>{{ value }}</span>
      </v-card-text>
    </v-card>
  </v-col>
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
