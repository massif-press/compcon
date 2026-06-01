<template>
  <stepper-content :complete="canContinue"
    :mandatory="context === 'new'"
    :exit="context === 'new' ? '../pilot_management' : `/pilot/${pilot.ID}`"
    back
    @back="$emit('back')"
    @complete="$emit('next')">
    <cc-title offset>{{ context === 'new' ? 'Pilot Mech Skills' : 'Improve Mech Skills' }}&emsp;</cc-title>

    <div v-if="context === 'new'"
      class="heading h2">
      UAD IDENT Service <cc-slashes /> &nbsp;RM-4d Pilot Self Assessment (3/3)
    </div>
    <div v-else
      class="heading h2">
      MV-2 License Acquisition Request <cc-slashes /> &nbsp;MV-2//c Frame Configuration Update
    </div>

    <p v-if="context === 'new'"
      class="flavor-text"
      style="font-size: 14px">
      The RM-4b PILOT SELF ASSESSMENT (Mech Skills) will be transmitted to print staff to finalize
      the configuration of your issued GMS-SP1 EVEREST.
    </p>
    <p v-else
      class="flavor-text"
      style="font-size: 14px">
      On acceptance of the MV-2//c Frame Configuration Update the Union IDENT//eng subsystem will
      automatically update the frame configuration protocols stored in the Omninet Vault address
      registered to your IDENT profile (V.node::/{{ pilot.ID }}).
    </p>

    <v-alert color="accent"
      variant="outlined"
      density="compact"
      class="mt-2"
      tile>
      <div class="heading">
        {{ context === 'new' ? `Add ${word} (${count}) Mech Skill Points.` : 'Improve a Mech Skill.' }}
      </div>
      <p class="text-cc-overline">
        By submitting this form you attest that your responses are truthful and accurate to the best
        of your knowledge. Knowingly providing false or incomplete information is punishable
        under DoJ/HR AR 303-J.
      </p>
    </v-alert>

    <mech-skills-selector level-up
      :pilot="<Pilot>pilot" />
  </stepper-content>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import StepperContent from '../../_components/StepperContent.vue'
import MechSkillsSelector from '../../_components/selectors/MechSkillsSelector.vue'
import { Pilot } from '@/classes/pilot/Pilot'

defineOptions({ name: 'mech-skills-page' })

const props = defineProps<{
  pilot: Pilot
  context: 'new' | 'level'
}>()

const emit = defineEmits<{ back: []; next: [] }>()

const canContinue = computed(() => !(props.pilot as any).MechSkillsController.IsMissingHASE)
const count = computed(() => (props.pilot as any).MechSkillsController.MaxHASEPoints)
const word = computed(() => {
  const words = ['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen']
  return words[count.value] ?? count.value
})
</script>
