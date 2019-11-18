<template>
  <v-alert
    :color="color"
    prominent
    dense
    border="left"
    class="flavor-text heading h2"
    :icon="icon"
    dark
  >
    / /&emsp;
    <span v-if="type === 'ejected'">PILOT EJECTED</span>
    <span v-if="type === 'destroyed'">MECH DESTROYED</span>
    <span v-if="type === 'meltdown'">REACTOR MELTDOWN IMMINENT</span>
    <span v-if="type === 'reactorDestroyed'">REACTOR DESTROYED</span>
    &emsp;/ /
  </v-alert>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'status-alert',
  props: {
    type: {
      type: String,
      required: true,
    },
  },
  computed: {
    icon() {
      switch (this.type) {
        case 'ejected':
          return 'mdi-account-off-outline'
          break
        case 'destroyed':
          return 'mdi-image-broken-variant'
          break
        case 'meltdown':
          return 'mdi-alert-outline'
          break
        case 'reactorDestroyed':
          return 'mdi-nuke'
          break
        default:
          return ''
          break
      }
    },
    color() {
      switch (this.type) {
        case 'ejected':
          return 'warning darken-1'
          break
        case 'destroyed':
          return 'error'
          break
        case 'meltdown':
          return 'dangerzone'
          break
        case 'reactorDestroyed':
          return 'accent darken-1'
          break
        default:
          return 'grey'
          break
      }
    },
  },
})
</script>