<template>
  <cc-solo-dialog ref="dialog" icon="cci-pilot" no-confirm title="Edit Pilot level">
    <v-card-text>
      <v-alert
        v-model="alert"
        border="left"
        close-text="Close"
        type="warning"
        color="stark"
        dismissible
        outlined
        prominent
      >
        This tool skips the level up wizard. Pilot attributes gained through levelling up, such as
        skill triggers, licenses, talents, mech skills, and CORE bonuses will have to be updated
        manually
      </v-alert>

      <v-row justify="center" align="center" class="text-center">
        <v-col cols="auto">
          <span class="overline">Current Level:</span>
          <br />
          <span
            style="display:inline-block"
            class="level-input"
          >
            {{ pilot.Level }}
          </span>
        </v-col>

        <v-col cols="auto" class="mx-3">
          <span class="overline"></span>
          <br />
          <v-icon x-large>arrow_forward</v-icon>
        </v-col>

        <v-col cols="auto">
          <span class="overline">New Level:</span>
          <br />
          <v-select
            v-model="newLevel"
            :items="levels"
            type="number"
            hide-details
            hide-spin-buttons
            dense
            outlined
            background-color="panel"
            class="level-input"
          />
        </v-col>
      </v-row>

      <v-row v-if="newLevel !== null" class="ma-4">
        <v-col class="ml-5 mr-5">
          <v-btn
            block
            color="primary"
            x-large
            :disabled="newLevel === '' || newLevel === pilot.Level"
            @click="setLevel"
          >
            Set Pilot Level
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </cc-solo-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { Rules } from '@/class'

export default Vue.extend({
  name: 'level-edit-dialog',
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    alert: true,
    newLevel: 0,
    levels: Array.from(Array(Rules.MaxPilotLevel + 1).keys())
  }),
  methods: {
    show() {
      this.$refs.dialog.show()
      this.alert = true
      this.newLevel = this.pilot.Level
    },
    hide() {
      this.$refs.dialog.hide()
    },
    setLevel() {
      this.pilot.Level = parseInt(this.newLevel) || 0
      this.$store.dispatch('cloudSync', { callback: null, condition: 'pilotLevel' })
      this.hide()
    },
  },
})
</script>

<style>
.level-input {
  font-size: 55px;
  width: 120px !important;
  height: 65px !important;
  line-height: 65px !important;
}

.level-input .v-select__selection {
  font-size: 55px;
  width: 90px !important;
  height: 65px !important;
  line-height: 65px !important;
}

.level-input input {
  display: none;
}

.level-input .v-input__control,
.level-input .v-input__slot {
  width: inherit !important;
  height: inherit !important;
  text-align: center !important;
}

.level-input .v-input__append-inner {
  align-self: center !important;
  margin: 0 !important;
}

</style>
