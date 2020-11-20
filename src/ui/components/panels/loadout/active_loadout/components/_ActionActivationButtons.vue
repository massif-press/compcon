<template>
  <v-col cols="auto">
    <v-btn
      large
      tile
      block
      :disabled="disableCostActivate"
      :color="`${action.Color}`"
      @click="select()"
    >
      <v-icon left>{{ action.Icon }}</v-icon>
      {{ action.Name }}
    </v-btn>
    <v-btn
      v-if="action.Activation !== 'Free'"
      small
      tile
      block
      :disabled="action.Used"
      color="action--free"
      @click="select(true)"
    >
      <v-icon left small>cci-free-action</v-icon>
      Free Action
      <cc-tooltip
        inline
        :content="
          `Special rules or equipment may allow you to ${action.Name} as a Free Action. Using this button will commit the action without spending a ${action.Activation} Action this turn`
        "
      >
        <v-icon right small class="fadeSelect">mdi-information-outline</v-icon>
      </cc-tooltip>
    </v-btn>
    <div v-if="action.HeatCost" class="overline error--text text-center">
      ALERT: This action will incur {{ action.HeatCost }} heat
    </div>
  </v-col>
</template>

<script lang="ts">
import { ActivationType } from '@/class'
import Vue from 'vue'
export default Vue.extend({
  name: 'action-activation-buttons',
  props: {
    action: {
      type: Object,
      required: true,
    },
    mech: {
      type: Object,
      required: true,
    },
  },
  computed: {
    disableCostActivate() {
      if (this.action.Used) return true
      if (this.action.Activation === ActivationType.Protocol)
        return !this.mech.Pilot.State.IsProtocolAvailable
      let activationCost = 0
      if (this.action.Activation === ActivationType.Quick) activationCost = 1
      else if (this.action.Activation === ActivationType.Full) activationCost = 2
      return this.mech.Pilot.State.Actions < activationCost
    },
  },
  methods: {
    select(free: boolean) {
      this.mech.Pilot.State.CommitAction(this.action, free)
    },
  },
})
</script>
