<template>
  <v-snackbar v-model="model" :color="color" tile right style="z-index: 9999">
    <slot></slot>
    <v-btn color="white" text @click="model = false">
      <v-icon large>close</v-icon>
    </v-btn>
  </v-snackbar>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'cc-notification',
  props: {
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
  },
  data: () => ({
    model: false,
  }),
  methods: {
    close() {
      this.model = false
    },
    open() {
      this.model = true
    },
  },
})
</script>
