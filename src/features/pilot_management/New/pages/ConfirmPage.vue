<template>
  <stepper-content
    :complete="pilotReady"
    :mandatory="!quickstart"
    exit="pilot_management"
    back
    no-confirm
    @back="$emit('back')"
  >
    <pilot-registration-card :pilot="pilot" :pilot-ready="pilotReady" />
    <br />
    <v-alert type="error" variant="outlined" v-if="!pilotReady">
      <span class="stat-text text-accent">
        WARNING: Submission for IDENT record {{ pilot.ID }} has the following issue(s):
      </span>
      <ul class="flavor-text text-error">
        <li v-if="!pilot.Callsign">PILOT CALLSIGN blank or invalid</li>
        <li v-if="!pilot.Name">PILOT NAME blank or invalid</li>
        <li v-if="!pilot.SkillsController.HasFullSkills">
          PILOT SKILL TRIGGERS missing or incomplete
        </li>
        <li v-if="!pilot.TalentsController.HasFullTalents">PILOT TALENTS missing or incomplete</li>
        <li v-if="!pilot.MechSkillsController.HasFullHASE">
          PILOT MECH SKILLS missing or incomplete
        </li>
      </ul>
    </v-alert>
    <v-btn
      size="x-large"
      block
      :disabled="!pilotReady && !quickstart"
      color="secondary-darken-2"
      tile
      class="mx-2 my-8"
      @click="savePilot()"
    >
      <span>
        Register New Pilot // {{ pilot.Callsign || default_callsign }} ({{
          pilot.Name || default_name
        }})
      </span>
    </v-btn>
  </stepper-content>
</template>

<script lang="ts">
import PilotRegistrationCard from '../../PilotSheet/components/PilotRegistrationCard.vue';
import StepperContent from '../../_components/StepperContent.vue';
import { Pilot } from '@/classes/pilot/Pilot';

import { PilotStore } from '@/stores';

export default {
  name: 'confirm-page',
  components: { PilotRegistrationCard, StepperContent },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
    quickstart: { type: Boolean },
    groupID: { type: String },
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
      this.pilot.Callsign = this.pilot.Callsign ? this.pilot.Callsign : this.default_callsign;
      this.pilot.Name = this.pilot.Name ? this.pilot.Name : this.default_name;
      store.AddPilot(this.pilot as Pilot, this.groupID);
      this.$emit('done');
    },
  },
};
</script>
