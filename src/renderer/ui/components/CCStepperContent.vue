<template>
  <div>
    <slot />
    <v-divider class="ma-3" />
    <v-row class="mx-3">
      <v-btn large text :to="exit">EXIT</v-btn>
      <v-spacer />
      <v-btn
        color="primary"
        :disabled="!back"
        large
        text
        class="ml-auto mr-2"
        @click="$emit('back')"
      >BACK</v-btn>
      <v-btn
        v-if="!noConfirm"
        color="success"
        :disabled="!complete"
        large
        tile
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
    back: {
      type: Boolean,
      required: false,
    },
    exit: {
      type: String,
      required: true,
    },
    noConfirm: {
      type: Boolean,
      required: false,
    },
  },
})
</script>