<template>
  <stepper-content
    :complete="canContinue"
    mandatory
    exit="pilot_management"
    back
    @back="$emit('back')"
    @complete="$emit('next')">
    <cc-title offset>Pilot Talents&emsp;</cc-title>
    <div class="heading h2">
      UAD IDENT Service
      <cc-slashes />
      &nbsp;RM-4c Pilot Self Assessment (2/3)
    </div>
    <p class="flavor-text" style="font-size: 14px">
      The RM-4b PILOT SELF ASSESSMENT (Talents) audit catalogs an individual pilot's self-reported
      combat operation aptitudes and confers requisition privileges for simulator time, holofield
      and cortical sensorium training materials, battlefield telemetry data at classifications below
      GREY SIERRA SHARP, and (in specific cases) GMS MM-pattern materiel licenses. Additional
      resources may be made available at your request in the course of field operations.
    </p>
    <v-alert color="accent" variant="outlined" density="compact" class="mt-2" tile>
      <div class="heading">Select {{ word }} ({{ count }}) Pilot Talents.</div>
      <p class="text-cc-overline">
        By submitting this form you attest that your responses are truthful and accurate to the best
        of your knowledge. Knowingly providing false or or incomplete information is punishable
        under DoJ/HR AR 303-J.
      </p>
    </v-alert>
    <talent-selector level-up flat :pilot="<Pilot>pilot" />
  </stepper-content>
</template>

<script lang="ts">
import StepperContent from '../../_components/StepperContent.vue';
import TalentSelector from '../../_components/selectors/TalentSelector.vue';
import { Pilot } from '@/class';
export default {
  name: 'talents-page',
  components: {
    StepperContent,
    TalentSelector,
  },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
  computed: {
    canContinue(): boolean {
      return this.pilot.TalentsController.HasFullTalents;
    },
    count(): number {
      return this.pilot.TalentsController.MaxTalentPoints;
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
