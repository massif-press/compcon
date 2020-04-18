<template>
  <cc-stepper-content
    :complete="canContinue()"
    :exit="`/pilot/${pilot.ID}`"
    back
    no-confirm
    @back="$emit('back')"
  >
    <pilot-registration-card :pilot="pilot" :pilot-ready="pilotReady" />
    <v-btn
      x-large
      block
      :disabled="!pilotReady"
      color="secondary"
      tile
      class="mx-2 my-8"
      @click="savePilot()"
    >
      Update Pilot Record // {{ pilot.Callsign }} ({{ pilot.Name }})
    </v-btn>
    <v-alert type="error" outlined :value="!pilotReady">
      <span class="stat-text accent--text">
        WARNING: IDENT record {{ pilot.ID }} cannot be updated due to the following reason(s):
      </span>
      <ul class="flavor-text error--text">
        <li v-if="!pilot.Callsign">PILOT CALLSIGN blank or invalid</li>
        <li v-if="!pilot.Name">PILOT NAME blank or invalid</li>
        <li v-if="!pilot.HasFullSkills">PILOT SKILL TRIGGERS incomplete or invalid</li>
        <li v-if="!pilot.HasFullTalents">PILOT TALENTS incomplete or invalid</li>
        <li v-if="!pilot.HasFullHASE">PILOT MECH SKILLS incomplete or invalid</li>
        <li v-if="!pilot.HasLicenses">PILOT LICENSES incomplete or invalid</li>
        <li v-if="!pilot.HasCBs">PILOT CORE BONUSES incomplete or invalid</li>
      </ul>
    </v-alert>
  </cc-stepper-content>
</template>

<script lang="ts">
import Vue from 'vue'
import { Pilot } from '@/class'
import PilotRegistrationCard from '../../PilotSheet/components/PilotRegistrationCard.vue'

export default Vue.extend({
  name: 'confirm-page',
  components: { PilotRegistrationCard },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
    original: {
      type: Object,
      required: true,
    },
  },
  computed: {
    pilotReady(): boolean {
      return (
        this.pilot.HasIdent &&
        this.pilot.HasFullSkills &&
        this.pilot.HasFullTalents &&
        this.pilot.HasFullHASE
      )
    },
  },
  methods: {
    savePilot() {
      this.original.ApplyLevel(Pilot.Serialize(this.pilot))
      this.$router.push({ name: 'pilot_sheet', params: { id: this.pilot.ID } })
    },
    canContinue() {
      return (
        this.pilot.Callsign &&
        this.pilot.Name &&
        this.pilot.HasFullSkills &&
        this.pilot.HasFullTalents &&
        this.pilot.HasFullHASE &&
        this.pilot.HasLicenses &&
        this.pilot.HasCBs
      )
    },
  },
})
</script>
