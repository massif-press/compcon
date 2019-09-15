<template>
  <cc-stepper-content :complete="canContinue" exit="pilot_management" @complete="$emit('next')"></cc-stepper-content>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'identification-page',
  props: {
    newPilot: {
      type: Object,
      required: true,
    },
  },
  computed: {
    canContinue(): boolean {
      return !!(this.newPilot.Name && this.newPilot.Callsign)
    },
  },
})
</script>