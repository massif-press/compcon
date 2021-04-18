<template>
  <div>
    <action-detail-expander :action="action" />
    <v-row justify="center" align="center">
      <v-col>
        <v-row dense justify="space-around">
          <v-col cols="12" lg="auto">
            <div class="heading h3 text-center">Choose one of the following:</div>
            <v-radio-group v-model="state.StabilizeMajor" dense hide-details colum>
              <v-radio
                label="Cool Mech, resetting the heat gauge and ending the EXPOSED status"
                value="cool"
                color="accent"
              />
              <v-radio
                :label="`Spend 1 Repair to restore HP to maximum. ${
                  !mech.CurrentRepairs ? ' // REPAIR CAPACITY EXHAUSTED //' : ''
                }`"
                value="repair"
                color="accent"
                :disabled="!mech.CurrentRepairs"
              />
            </v-radio-group>
          </v-col>
          <v-col cols="auto">
            <v-divider vertical />
          </v-col>
          <v-col cols="12" lg="auto">
            <div class="heading h3 text-center">And one of the following:</div>
            <v-radio-group v-model="state.StabilizeMinor" color="accent" dense hide-details column>
              <v-radio
                label="Reload all weapons with the LOADING Tag"
                value="reload"
                color="accent"
              />
              <v-radio
                label="End all BURN currently affecting your mech"
                value="end_burn"
                color="accent"
                :disabled="mech.Burn === 0"
              />
              <v-radio
                label="End a condition affecting your mech"
                value="end_self_condition"
                color="accent"
                :disabled="!mech.Conditions.length"
              />
              <v-radio
                label="End a condition affecting an adjacent ally"
                value="end_ally_condition"
                color="accent"
              />
            </v-radio-group>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="auto">
        <v-btn
          large
          tile
          block
          dark
          :disabled="!canUse"
          :color="action.Color"
          @click="$emit('use')"
        >
          <v-icon left>{{ action.Icon }}</v-icon>
          {{ action.Name }}
        </v-btn>
        <v-btn
          v-if="action.Activation !== 'Free'"
          small
          dark
          tile
          block
          :disabled="!canUse"
          color="action--free"
          @click="$emit('use', true)"
        >
          <v-icon left small>cci-free-action</v-icon>
          Free Action
          <cc-tooltip
            inline
            :content="`Special rules or equipment may allow you to ${action.Name} as a Free Action. Using this button will commit the action without spending a ${action.Activation} Action this turn`"
          >
            <v-icon right small class="fadeSelect">mdi-information-outline</v-icon>
          </cc-tooltip>
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ActionDetailExpander from '../../components/_ActionDetailExpander.vue'

export default Vue.extend({
  name: 'stabilize-dialog',
  components: { ActionDetailExpander },
  props: {
    used: { type: Boolean },
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
    canUse() {
      return this.state.StabilizeMajor && this.state.StabilizeMinor
    },
  },
})
</script>
