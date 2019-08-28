<template>
  <v-snackbar v-model="model" color="primary" tile right>
    <slot></slot>
    <v-btn color="white" text @click="close">
      <v-icon large>close</v-icon>
    </v-btn>
  </v-snackbar>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'cc-notification',
  props: {
    model: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  methods: {
    close() {
      this.$emit('close')
    },
  },
})
</script>
