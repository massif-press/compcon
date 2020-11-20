<template>
  <cc-titlebar large :color="unusable ? '#616161' : action.Color">
    <v-icon x-large v-html="unusable ? 'mdi-cancel' : action.Icon" />
    {{ action.Name }}
    <span v-if="unusable" class="flavor-text">
      <cc-slashes />
      Action Unavailable
    </span>
    <span v-else-if="action.Origin" class="flavor-text">
      <cc-slashes />
      {{ action.Origin }}
    </span>
    <v-btn slot="items" dark icon @click="$emit('hide')">
      <v-icon large left>close</v-icon>
    </v-btn>
  </cc-titlebar>
</template>

<script lang="ts">
import { ActivationType } from '@/classes/enums'
import Vue from 'vue'
export default Vue.extend({
  name: 'action-titlebar',
  props: {
    mech: {
      type: Object,
      required: true,
    },
    action: {
      type: Object,
      required: true,
    },
  },
  computed: {
    state() {
      return this.mech.Pilot.State
    },
    cost() {
      if (this.action.Activation === ActivationType.Full) return 2
      if (this.action.Activation === ActivationType.Quick) return 1
      return 0
    },
    unusable() {
      if (this.action.Activation === ActivationType.Protocol)
        return this.action.Used || !this.mech.Pilot.State.IsProtocolAvailable
      return this.action.Used || this.state.Actions < this.cost
    },
  },
})
</script>
