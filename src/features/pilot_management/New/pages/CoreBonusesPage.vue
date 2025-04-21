<template>
  <stepper-content
    :complete="canContinue"
    mandatory
    exit="../pilot_management"
    back
    @back="$emit('back')"
    @complete="$emit('next')">
    <cc-title offset>Pilot Talents&emsp;</cc-title>
    <div class="heading h2">
      UAD IDENT Service
      <cc-slashes />
      &nbsp;RM-4c (S-2) Core Modification Supplemental
    </div>
    <p class="flavor-text" style="font-size: 14px">
      The RM-4β Supplemental II (Core Modification) registers a individual pilot's Core Modification
      Data (CMD) Archive to be made available for printing and outfitting services. The following
      catalog represents all Core Modifications currently validated as FAB-COMPLETE by General
      Massive Systems' Universal Frame Standard, as adopted by the Union Licensing Authority.
    </p>
    <v-alert color="accent" variant="outlined" density="compact" class="mt-2" tile>
      <div class="heading">
        Select {{ word }} ({{ count }}) Core {{ count > 1 ? 'Bonuses' : 'Bonus' }}.
      </div>
      <p class="text-cc-overline">
        The Union Licensing Authority and the Union Administration Department hereby disclaim any
        and all responsibility, liability, or obligation for any modifications, alterations,
        adaptations, or amendments (hereinafter, "Core Modifications") made to any system,
        component, framework, or substrate, whether physical, digital, conceptual, or metaphysical,
        regardless of the timing, method, or intent of such modifications.
      </p>
    </v-alert>
    <core-bonus-selector flat :pilot="<Pilot>pilot" />
  </stepper-content>
</template>

<script lang="ts">
import StepperContent from '../../_components/StepperContent.vue';
import CoreBonusSelector from '../../_components/selectors/CoreBonusSelector.vue';
import { Pilot } from '@/class';

export default {
  name: 'talents-page',
  components: {
    StepperContent,
    CoreBonusSelector,
  },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
  computed: {
    canContinue(): boolean {
      return this.pilot.CoreBonusController.HasCBs;
    },
    count(): number {
      return this.pilot.CoreBonusController.MaxCBPoints;
    },
    word(): string {
      const words = [
        'zero',
        'one',
        'two',
        'three',
        'four',
        'five',
        'six',
        'seven',
        'eight',
        'nine',
        'ten',
        'eleven',
        'twelve',
        'thirteen',
        'fourteen',
        'fifteen',
        'sixteen',
      ];
      return words[this.count];
    },
  },
};
</script>
