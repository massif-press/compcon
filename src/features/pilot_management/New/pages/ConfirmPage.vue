<template>
  <cc-stepper-content
    :complete="pilotReady"
    exit="pilot_management"
    back
    no-confirm
    @back="$emit('back')"
  >
    <pilot-registration-card :pilot="pilot" :pilot-ready="pilotReady" />
    <br />
    <v-alert type="error" outlined :value="!pilotReady">
      <span class="stat-text accent--text">
        WARNING: Submission for IDENT record {{ pilot.ID }} has the following issue(s):
      </span>
      <ul class="flavor-text error--text">
        <li v-if="!pilot.Callsign">PILOT CALLSIGN blank or invalid</li>
        <li v-if="!pilot.Name">PILOT NAME blank or invalid</li>
        <li v-if="!pilot.HasFullSkills">PILOT SKILL TRIGGERS missing or incomplete</li>
        <li v-if="!pilot.HasFullTalents">PILOT TALENTS missing or incomplete</li>
        <li v-if="!pilot.HasFullHASE">PILOT MECH SKILLS missing or incomplete</li>
      </ul>
    </v-alert>
    <v-btn
      :x-large="$vuetify.breakpoint.mdAndUp"
      block
      color="secondary"
      tile
      class="mx-2 my-8"
      @click="savePilot()"
    >
      <span v-if="$vuetify.breakpoint.mdAndUp">
        Register New Pilot // {{ pilot.Callsign || default_callsign }} ({{
          pilot.Name || default_name
        }})
      </span>
      <span v-else>Register Pilot</span>
    </v-btn>
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
  data: () => ({
    default_callsign: "[NEW CALLSIGN]",
    default_name: "New Pilot"
  }),
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
      this.pilot.Callsign = this.pilot.Callsign ? this.pilot.Callsign : this.default_callsign
      this.pilot.Name = this.pilot.Name ? this.pilot.Name : this.default_name
      store.addPilot({ pilot: this.pilot, update: true })
      this.$emit('done')
    },
  },
})
</script>
