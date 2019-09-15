<template>
  <div>
    <slot />
    <v-divider class="ma-3" />
    <v-row class="mx-3">
      <v-btn large text :to="exit">EXIT</v-btn>
      <v-spacer />
      <v-btn
        color="success"
        :disabled="!complete"
        large
        tile
        class="ml-auto"
        @click="$emit('complete')"
      >CONTINUE</v-btn>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'cc-stepper-content',
  props: {
    complete: {
      type: Boolean,
      required: true,
    },
    exit: {
      type: String,
      required: true,
    },
  },
})
</script>