<template>
  <v-dialog v-model="dialog" scrollable max-width="80vw" transition="dialog-transition">
    <v-card tile>
      <v-toolbar flat dense dark color="action--full" class="heading h2">Stabilize</v-toolbar>
      <v-card-text class="flavor-text pb-0">
        <p class="pt-2 text--text">
          Enact emergency protocols in order to purge your mech‘s systems of excess heat, repair
          your chassis where you can, and buy your system time to eliminate hostile code.
        </p>
        <div class="heading h3 error--text text-center">
          <b>// WARNING: THIS ACTION CANNOT BE UNDONE //</b>
        </div>
        <p class="text-center heading h3 pb-0">
          <span class="flavor-text">Choose one of the following:</span>
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
          <span class="flavor-text">And one of the following:</span>
          <v-radio-group v-model="stabilizeMinor">
            <v-radio label="Reload all weapons with the Loading Tag" value="reload" />
            <v-radio
              label="End all Burn currently affecting your mech"
              value="end_burn"
              :disabled="mech.Burn === 0"
            />
            <v-radio
              label="End a condition affecting your mech"
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
        <v-btn text @click="dialog = false">Cancel</v-btn>
        <v-spacer />
        <v-btn
          large
          dark
          tile
          color="primary"
          :disabled="!stabilizeMajor || !stabilizeMinor"
          @click="stabilize()"
        >
          Stabilize
        </v-btn>
      </v-card-actions>
    </v-card>
    <condition-dialog ref="condition" :mech="mech" />
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import ConditionDialog from './ConditionDialog.vue'

export default Vue.extend({
  name: 'stabilize-dialog',
  components: { ConditionDialog },
  props: {
    mech: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    dialog: false,
    stabilizeMajor: null,
    stabilizeMinor: null,
    redundant: false,
  }),
  methods: {
    show(isRedundant: boolean) {
      this.redundant = isRedundant
      this.dialog = true
    },
    stabilize() {
      switch (this.stabilizeMajor) {
        case 'cool':
          this.mech.CurrentHeat = 0
          this.endStatus('Exposed')
          break
        case 'repair':
          this.mech.CurrentRepairs -= 1
          this.mech.CurrentHP = this.mech.MaxHP
          break
      }
      switch (this.stabilizeMinor) {
        case 'reload':
          this.mech.ActiveLoadout.ReloadAll()
          break
        case 'end_burn':
          this.mech.Burn = 0
          break
        case 'end_self_condition':
          this.$refs.condition.show()
        case 'end_ally_condition':
          break
      }
      this.$emit('stabilize', this.redundant ? 0 : -2)
      this.dialog = false
    },
    endStatus(s: string) {
      const stidx = this.mech.Statuses.findIndex(x => x === s)
      if (stidx > -1) this.mech.Statuses.splice(stidx, 1)
    },
  },
})
</script>
