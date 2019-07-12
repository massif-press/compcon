<template>
  <v-card dark height="100%" class="ma-1">
    <v-card-title class="pa-0 pl-2 pr-2" :style="`background-color: ${color}`">
      <span class="minor-title">{{ header }}</span>
      <v-spacer />
      <span class="caption">{{ subheader }}</span>
    </v-card-title>
    <v-card-text class="pa-1">
      <slot></slot>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'active-card',
  props: {
    color: String,
    header: String,
    subheader: String,
  },
})
</script>
