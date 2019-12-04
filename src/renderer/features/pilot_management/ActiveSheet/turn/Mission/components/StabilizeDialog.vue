<template>
  <v-dialog v-model="dialog" scrollable max-width="80vw" transition="dialog-transition">
    <v-card>
      <v-toolbar flat dark color="indigo darken-1" class="heading h2">Stabilize</v-toolbar>
      <v-card-text class="effect-text pb-0">
        <p>
          Enact emergency protocols in order to purge your mech‘s systems of excess heat, repair
          your chassis where you can, and buy your system time to eliminate hostile code.
        </p>
        <p class="caption red--text text-center pa-0">
          <b>// WARNING: THIS ACTION CANNOT BE UNDONE //</b>
        </p>
        <p class="text-center heading h3 pb-0">
          <span class="caption">Choose one of the following:</span>
          <v-radio-group v-model="stabilizeMajor">
            <v-radio
              label="Cool Mech, resetting the heat gauge and ending the exposed status"
              value="cool"
            />
            <v-radio
              :label="
                `Spend 1 Repair to refill HP to maximum. ${
                  !mech.CurrentRepairs ? ' // REPAIR CAPACITY EXHAUSTED //' : ''
                }`
              "
              value="repair"
              :disabled="!mech.CurrentRepairs"
            />
          </v-radio-group>
          <v-divider class="mt-2 mb-2 ml-5 mr-5" />
          <span class="caption">And one of the following:</span>
          <v-radio-group v-model="stabilizeMinor">
            <v-radio label="Reload all weapons with the Loading Tag" value="reload" />
            <v-radio
              :label="
                `End all Burn currently affecting your mech ${
                  mech.Burn === 0 ? ' // BURN STATUS NOMINAL //' : ''
                }`
              "
              value="end_burn"
              :disabled="mech.Burn === 0"
            />
            <v-radio
              :label="
                `End a condition affecting your mech ${
                  !mech.Conditions.length ? ' // MECH STATUS NOMINAL //' : ''
                }`
              "
              value="end_self_condition"
              :disabled="!mech.Conditions.length"
            />
            <v-radio
              label="End a condition affecting an adjacent ally"
              value="end_ally_condition"
            />
          </v-radio-group>
        </p>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-btn flat color="primary" @click="stabilizeDialog = false">Cancel</v-btn>
        <v-spacer />
        <v-btn
          large
          dark
          color="indigo darken-3"
          :disabled="!stabilizeMajor || !stabilizeMinor"
          @click="commitStabilize"
        >
          Stabilize
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'stabilize-dialog',
  props: {
    mech: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    dialog: false,
  }),
  methods: {
    show() {
      this.dialog = true
    },
  },
})
</script>
