<template>
  <stepper-content
    :complete="pilotReady"
    mandatory
    exit="../pilot_management"
    back
    no-confirm
    @back="$emit('back')">
    <pilot-registration-card :pilot="pilot" :pilot-ready="pilotReady" />
    <br />
    <v-alert type="error" variant="outlined" tile v-if="!pilotReady">
      <span class="stat-text text-accent">
        WARNING: Submission for IDENT record {{ pilot.ID }} has the following issue(s):
      </span>
      <ul class="flavor-text text-error">
        <li v-if="!pilot.Callsign">
          <v-icon icon="mdi-alert" size="small" class="mx-n1" />
          CRITICAL
          <v-icon icon="mdi-alert" size="small" class="mx-n1" />
          &nbsp;PILOT CALLSIGN blank or invalid
        </li>
        <li v-if="!pilot.Name">
          <v-icon icon="mdi-alert" size="small" class="mx-n1" />
          CRITICAL
          <v-icon icon="mdi-alert" size="small" class="mx-n1" />
          &nbsp;PILOT NAME blank or invalid
        </li>
        <li v-if="!pilot.SkillsController.HasFullSkills">
          PILOT SKILL TRIGGERS missing or incomplete
        </li>
        <li v-if="!pilot.TalentsController.HasFullTalents">PILOT TALENTS missing or incomplete</li>
        <li v-if="!pilot.MechSkillsController.HasFullHASE">
          PILOT MECH SKILLS missing or incomplete
        </li>
        <li v-if="!pilot.LicenseController.HasLicenses">
          PILOT LICENSE DATA missing or incomplete
        </li>
        <li v-if="!pilot.CoreBonusController.HasCBs">
          PILOT CORE BONUS DATA missing or incomplete
        </li>
      </ul>
    </v-alert>
    <cc-button
      block
      color="success"
      class="my-6"
      prepend-icon="cc:orbital"
      :disabled="!pilotReady"
      @click="savePilot()">
      <span>
        Register New Pilot // {{ pilot.Callsign || default_callsign }} ({{
          pilot.Name || default_name
        }})
      </span>
    </cc-button>
    <div v-if="!pilotReady" class="text-right">
      <div class="d-inline-block">
        <cc-button
          size="small"
          color="primary"
          tooltip="Force pilot registration"
          :disabled="missingBasicInfo"
          @click="savePilot()">
          Registration Override
        </cc-button>
      </div>
    </div>
  </stepper-content>
</template>

<script lang="ts">
import { AchievementEventSystem } from '@/user/achievements/AchievementEvent';
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
        this.pilot.MechSkillsController.HasFullHASE &&
        this.pilot.LicenseController.HasLicenses &&
        this.pilot.CoreBonusController.HasCBs
      );
    },
    missingBasicInfo(): boolean {
      return !this.pilot.Callsign || !this.pilot.Name;
    },
  },
  methods: {
    savePilot() {
      const store = PilotStore();
      this.pilot.Callsign = this.pilot.Callsign ? this.pilot.Callsign : this.default_callsign;
      this.pilot.Name = this.pilot.Name ? this.pilot.Name : this.default_name;
      store.AddPilot(this.pilot as Pilot, this.groupID);

      if (this.pilot.isTemplate) AchievementEventSystem.emit('add_template_pilot');
      AchievementEventSystem.emit('add_pilot');

      this.$emit('done');
    },
  },
};
</script>
