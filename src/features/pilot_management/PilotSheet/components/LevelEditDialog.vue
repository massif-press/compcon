<template>
  <cc-solo-dialog ref="dialog" icon="cci-pilot" no-confirm title="Edit Pilot level">
    <v-card-text>
      <span>A flavorful description...</span>

      <v-alert
        v-model="alert"
        border="left"
        close-text="Close"
        type="warning"
        dismissible
        outlined
        prominent
      >
        This tool skips the level up wizard. Pilot attributes gained through levelling up, such as skill triggers, licenses, talents, mech skills, and CORE
        bonuses will have to be updated manually
      </v-alert>

      <v-row justify="center" class="text-center">
        <v-col cols="auto">
          <span class="overline">Current Level:</span>
          <br />
          <v-text-field
            v-model="pilot.Level"
            readonly
            type="number"
            hide-details
            dense
            outlined
            background-color="grey lighten-3"
            class="level-input"
          />
        </v-col>

        <v-col cols="1">
          <v-icon x-large>arrow_forward</v-icon>
        </v-col>

        <v-col cols="auto">
          <span class="overline">New Level:</span>
          <br />
          <v-text-field
            v-model="newLevel"
            type="number"
            maxlength="2"
            hide-details
            dense
            outlined
            background-color="white"
            class="level-input"
            @change="checkNewLevel()"
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
          >Set Pilot Level</v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </cc-solo-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { rules } from 'lancer-data'

const maxLvl = parseInt(rules.max_pilot_level) || 12

export default Vue.extend({
  name: 'cloud-dialog',
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    alert: true,
    newLevel: 0,
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
    checkNewLevel() {
      if (this.newLevel.length > 2) this.newLevel = this.newLevel.substring(0, 2)
      const lvl = parseInt(this.newLevel) || 0
      if (lvl < 0) this.newLevel = 0
      if (lvl > maxLvl) this.newLevel = maxLvl
    },
    setLevel() {
      let lvl = parseInt(this.newLevel) || 0
      if (lvl > maxLvl) lvl = maxLvl
      this.pilot.Level = lvl
      this.hide()
    },
  },
})
</script>

<style>
.level-input {
  font-size: 55px;
  width: 90px !important;
  height: 65px !important;
}

.level-input input {
  font-size: 55px;
  width: 90px !important;
  height: 65px !important;
  max-height: 65px !important;
}

.level-input .v-input__control,
.level-input .v-input__slot {
  width: inherit !important;
  height: inherit !important;
  text-align: center !important;
}

.level-input input::-webkit-outer-spin-button,
.level-input input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>