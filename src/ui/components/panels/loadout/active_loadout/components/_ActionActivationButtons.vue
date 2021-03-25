<template>
  <v-col cols="auto">
    <v-btn
      large
      tile
      block
      class="white--text"
      :disabled="disableCostActivate"
      :color="`${action.Color}`"
      @click="select()"
    >
      <v-icon left>{{ action.Icon }}</v-icon>
      {{ action.Name }}
    </v-btn>
    <v-btn
      v-if="action.Activation !== 'Free' && action.Activation !== 'Protocol'"
      small
      tile
      block
      class="white--text"
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
    used: { type: Boolean },
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
      if (this.used) return true
      if (this.action.Activation === ActivationType.Protocol)
        return !this.mech.Pilot.State.IsProtocolAvailable
      let activationCost = 0
      if (
        this.action.Activation === ActivationType.Quick ||
        this.action.Activation === ActivationType.QuickTech
      )
        activationCost = 1
      else if (
        this.action.Activation === ActivationType.Full ||
        this.action.Activation === ActivationType.FullTech
      )
        activationCost = 2
      return this.mech.Pilot.State.Actions < activationCost
    },
  },
  methods: {
    select(free: boolean) {
      this.$emit('use', free)
    },
  },
})
</script>
