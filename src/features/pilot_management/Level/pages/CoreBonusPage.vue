<template>
  <stepper-content
    :complete="!pilot.CoreBonusController.IsMissingCBs"
    :exit="`/pilot/${pilot.ID}`"
    back
    @back="$emit('back')"
    @complete="$emit('next')">
    <cc-title large offset>Add CORE Bonus</cc-title>
    <div class="heading h2">
      MV-2 License Acquisition Request
      <cc-slashes />
      &nbsp;MV-2(a) CORE Supplemental
    </div>
    <p class="flavor-text" style="font-size: 14px">
      The MV-2(a) Supplemental Amendment registers a major CORE modification, upgrade, retrofit, or
      enhancement. The Union Naval Intelligence Board, the Union Naval Licensing Board, the Union
      Administrative Pilot Advocacy Council, and The Union Department of Justice and Human Resources
      Ethical Engineering Subcommittee only recognize CORE augmentation from a Union-approved and
      registered Lincensor.
    </p>
    <v-alert color="accent" variant="outlined" density="compact" class="mt-2" tile>
      <div class="heading">Select a CORE Bonus</div>
      <p class="text-cc-overline">
        Implementing CORE augmentation protocols from a nonrecognized, phohibited, or unregistered
        Licensor or Licensors renders the operating pilot liable for any and all damages resultant
        from CORE malfunction, up to and including reactor meltdown.
      </p>
    </v-alert>
    <core-bonus-selector v-if="cbEligible" level-up flat :pilot="pilot" />
    <v-card v-else flat tile color="panel">
      <v-card-text class="flavor-text text-center py-5 px-3">
        <span class="heading h2 text-disabled text--darken-1">PILOT INELIGIBLE FOR CORE BONUS</span>
        <br />
        <span class="text-disabled text--darken-2">
          NEXT CORE BONUS IN {{ 3 - (pilot.Level % 3) }} LICENSE LEVELS
        </span>
      </v-card-text>
    </v-card>
  </stepper-content>
</template>

<script lang="ts">
import StepperContent from '../../_components/StepperContent.vue';
import CoreBonusSelector from '../../_components/selectors/CoreBonusSelector.vue';

export default {
  name: 'core-bonus-page',
  components: { StepperContent, CoreBonusSelector },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
    cbEligible: {
      type: Boolean,
    },
  },
};
</script>
