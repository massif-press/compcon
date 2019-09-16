<template>
  <v-container fluid style="overflow: hidden">
    <v-row>
      <v-col cols="3" :class="`pr-4 ${success ? 'bordered-success' : 'bordered-primary'}`">
        <cc-title small :color="success ? 'success' : 'primary'">{{ title }}</cc-title>
        <slot name="left-column" />
      </v-col>
      <v-col cols="9" style="height: 90vh; overflow-y: scroll">
        <slot name="right-column" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'selector',
  props: {
    title: {
      type: String,
      required: true,
    },
    height: {
      type: String,
      required: false,
      default: '90vh',
    },
    success: {
      type: Boolean,
      required: false,
    },
  },
})
</script>
