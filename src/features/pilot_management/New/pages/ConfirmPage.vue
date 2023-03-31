<template>
  <cc-stepper-content
    :complete="pilotReady"
    :mandatory="!quickstart"
    exit="pilot_management"
    back
    no-confirm
    @back="$emit('back')"
  >
    <pilot-registration-card :pilot="pilot" :pilot-ready="pilotReady" />
    <br />
    <v-alert type="error" variant="outlined" :value="!pilotReady">
      <span class="stat-text text-accent">
        WARNING: Submission for IDENT record {{ pilot.ID }} has the following
        issue(s):
      </span>
      <ul class="flavor-text text-error">
        <li v-if="!pilot.Callsign">PILOT CALLSIGN blank or invalid</li>
        <li v-if="!pilot.Name">PILOT NAME blank or invalid</li>
        <li v-if="!pilot.SkillsController.HasFullSkills">
          PILOT SKILL TRIGGERS missing or incomplete
        </li>
        <li v-if="!pilot.TalentsController.HasFullTalents">
          PILOT TALENTS missing or incomplete
        </li>
        <li v-if="!pilot.MechSkillsController.HasFullHASE">
          PILOT MECH SKILLS missing or incomplete
        </li>
      </ul>
    </v-alert>
    <v-btn
      :x-large="$vuetify.display.mdAndUp"
      block
      :disabled="!pilotReady && !quickstart"
      color="secondary"
      tile
      class="mx-2 my-8"
      @click="savePilot()"
    >
      <span v-if="$vuetify.display.mdAndUp">
        Register New Pilot // {{ pilot.Callsign || default_callsign }} ({{
          pilot.Name || default_name
        }})
      </span>
      <span v-else>Register Pilot</span>
    </v-btn>
  </cc-stepper-content>
</template>

<script lang="ts">
import PilotRegistrationCard from '../../PilotSheet/components/PilotRegistrationCard.vue';

import { PilotStore } from '@/stores';

export default {
  name: 'confirm-page',
  components: { PilotRegistrationCard },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
    quickstart: { type: Boolean },
  },
  data: () => ({
    default_callsign: '[NEW CALLSIGN]',
    default_name: 'New Pilot',
  }),
  computed: {
    pilotReady(): boolean {
      return (
        this.pilot.HasIdent &&
        this.pilot.SkillsController.HasFullSkills &&
        this.pilot.TalentsController.HasFullTalents &&
        this.pilot.MechSkillsController.HasFullHASE
      );
    },
  },
  methods: {
    savePilot() {
      const store = PilotStore();
      this.pilot.Callsign = this.pilot.Callsign
        ? this.pilot.Callsign
        : this.default_callsign;
      this.pilot.Name = this.pilot.Name ? this.pilot.Name : this.default_name;
      store.addPilot(this.pilot);
      this.$emit('done');
    },
  },
};
</script>
