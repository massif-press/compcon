<template>
  <stepper-content
    :complete="canContinue"
    :exit="`/pilot/${pilot.ID}`"
    back
    @back="$emit('back')"
    @complete="$emit('next')"
  >
    <cc-title large class="ml-n6">Improve Mech Skills&emsp;</cc-title>
    <h2 class="heading">
      MV-2 License Acquisition Request
      <cc-slashes />
      &nbsp;MV-2//c Frame Configuration Update
    </h2>
    <v-container class="flavor-text" style="font-size: 14px">
      <span>
        On acceptance of the MV-2//c Frame Configuration Update the Union IDENT//eng subsystem will
        automatically update the frame configuration protocols stored in the Omninet Vault address
        registered to your IDENT profile (V.node::/{{ pilot.ID }}). To ensure configuration data is
        remitted to the correct address, any changes in Vault node data must be submitted to the
        IDENT service using form RM-09-E IDENT Supplemental (e)
      </span>
      <v-alert color="accent" variant="outlined" density="compact" class="mt-2">
        <b>Improve a Mech Skill.</b>
        <br />
        <span class="text-overline">
          Union and its representatives are not liable for problems arising from FRAME configuration
          options that exceed manufacturer specifications. Consult the official FRAME datastore
          provided by the manufacturer prior to implementing any nonstandard CORE configuration.
        </span>
      </v-alert>
    </v-container>
    <mech-skills-selector level-up :pilot="(pilot as Pilot)" />
  </stepper-content>
</template>

<script lang="ts">
import MechSkillsSelector from '../../_components/selectors/MechSkillsSelector.vue';
import { Pilot } from '@/class';
import StepperContent from '../../_components/StepperContent.vue';

export default {
  name: 'mech-skills-page',
  components: { MechSkillsSelector, StepperContent },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
  computed: {
    canContinue(): boolean {
      return !this.pilot.MechSkillsController.IsMissingHASE;
    },
  },
};
</script>
