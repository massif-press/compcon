<template>
  <stepper-content
    :complete="canContinue"
    mandatory
    exit="../pilot_management"
    back
    @back="$emit('back')"
    @complete="$emit('next')">
    <cc-title offset>Pilot Mech Skills&emsp;</cc-title>
    <div class="heading h2">
      UAD IDENT Service
      <cc-slashes />
      &nbsp;RM-4d Pilot Self Assessment (3/3)
    </div>
    <p class="flavor-text" style="font-size: 14px">
      The RM-4b PILOT SELF ASSESSMENT (Mech Skills) will be transmitted to print staff to finalize
      the configuration of your issued GMS-SP1 EVEREST. This configuration data will be remitted to
      your personal Omninet vault on the validation and acceptance of the RM-4 form along with the
      issuance of your IDENT fingerprint, which then may be applied to any future Frame(s) at your
      discretion.
    </p>
    <v-alert color="accent" variant="outlined" density="compact" class="mt-2" tile>
      <div class="heading">Add {{ word }} ({{ count }}) Mech Skill Points.</div>
      <p class="text-cc-overline">
        By submitting this form you attest that your responses are truthful and accurate to the best
        of your knowledge. Knowingly providing false or or incomplete information is punishable
        under DoJ/HR AR 303-J.
      </p>
    </v-alert>
    <mech-skills-selector level-up :pilot="<Pilot>pilot" />
  </stepper-content>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import StepperContent from '../../_components/StepperContent.vue';
import MechSkillsSelector from '../../_components/selectors/MechSkillsSelector.vue';
import { Pilot } from '@/classes/pilot/Pilot'

defineOptions({ name: 'mech-skills-page' })

const props = defineProps<{
  pilot: object
}>()

const canContinue = computed(() => {
      return !props.pilot.MechSkillsController.IsMissingHASE;
    })
const count = computed(() => {
      return props.pilot.MechSkillsController.MaxHASEPoints;
    })
const word = computed(() => {
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
      return words[count.value];
    })
</script>
