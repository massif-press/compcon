<template>
  <cc-stepper-content
    :complete="pilotReady"
    exit="pilot_management"
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
      Register New Pilot // {{ pilot.Callsign || 'ERR CALLSIGN NOT FOUND' }} ({{
        pilot.Name || 'ERR NAME NOT FOUND'
      }})
    </v-btn>
    <v-alert type="error" outlined :value="!pilotReady">
      <span class="stat-text accent--text">
        WARNING: IDENT record {{ pilot.ID }} cannot be generated due to the following reason(s):
      </span>
      <ul class="flavor-text error--text">
        <li v-if="!pilot.Callsign">PILOT CALLSIGN blank or invalid</li>
        <li v-if="!pilot.Name">PILOT NAME blank or invalid</li>
        <li v-if="!pilot.HasFullSkills">PILOT SKILL TRIGGERS missing or incomplete</li>
        <li v-if="!pilot.HasFullTalents">PILOT TALENTS missing or incomplete</li>
        <li v-if="!pilot.HasFullHASE">PILOT MECH SKILLS missing or incomplete</li>
      </ul>
    </v-alert>
  </cc-stepper-content>
</template>

<script lang="ts">
import Vue from 'vue'
import PilotRegistrationCard from '../../PilotSheet/components/PilotRegistrationCard.vue'
import { getModule } from 'vuex-module-decorators'
import { PilotManagementStore } from '@/store'

export default Vue.extend({
  name: 'confirm-page',
  components: { PilotRegistrationCard },
  props: {
    pilot: {
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
      this.pilot.cc_ver = Vue.prototype.version
      const store = getModule(PilotManagementStore, this.$store)
      store.addPilot(this.pilot)
      this.$emit('done')
    },
  },
})
</script>
