<template>
  <stepper-content :complete="canContinue"
    :mandatory="context === 'new'"
    :exit="context === 'new' ? '../pilot_management' : `/pilot/${pilot.ID}`"
    back
    @back="$emit('back')"
    @complete="$emit('next')">
    <cc-title offset>{{ context === 'new' ? 'Pilot Talents' : 'Improve Talents' }}&emsp;</cc-title>

    <div v-if="context === 'new'"
      class="heading h2">
      UAD IDENT Service <cc-slashes /> &nbsp;RM-4c Pilot Self Assessment (2/3)
    </div>
    <div v-else
      class="heading h2">
      MV-2 License Acquisition Request <cc-slashes /> &nbsp;MV-2//b COA Resource Requisition
    </div>

    <p v-if="context === 'new'"
      class="flavor-text"
      style="font-size: 14px">
      The RM-4b PILOT SELF ASSESSMENT (Talents) audit catalogs an individual pilot's self-reported
      combat operation aptitudes and confers requisition privileges for simulator time, holofield
      and cortical sensorium training materials, battlefield telemetry data at classifications below
      GREY SIERRA SHARP, and (in specific cases) GMS MM-pattern materiel licenses.
    </p>
    <p v-else
      class="flavor-text"
      style="font-size: 14px">
      The Combat Operation Ability Requisition, on the approval of a NHP-guided automated request
      approval system, confers UNI simulator privileges, holofield and cortical sensorium training
      materials, battlefield telemetry data at classifications below GREY SIERRA SHARP, and (in
      specific cases) GMS MM-pattern materiel licenses.
    </p>

    <v-alert color="accent"
      variant="outlined"
      density="compact"
      class="mt-2"
      tile>
      <div class="heading">
        {{ context === 'new' ? `Select ${word} (${count}) Pilot Talents.` : 'Add or Upgrade a Talent.' }}
      </div>
      <p class="text-cc-overline">
        By submitting this form you attest that your responses are truthful and accurate to the best
        of your knowledge. Knowingly providing false or incomplete information is punishable
        under DoJ/HR AR 303-J.
      </p>
    </v-alert>

    <talent-selector level-up
      flat
      :pilot="<Pilot>pilot" />
  </stepper-content>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import StepperContent from '../../_components/StepperContent.vue'
import TalentSelector from '../../_components/selectors/TalentSelector.vue'
import { Pilot } from '@/classes/pilot/Pilot'

defineOptions({ name: 'talents-page' })

const props = defineProps<{
  pilot: Pilot
  context: 'new' | 'level'
}>()

const emit = defineEmits<{ back: []; next: [] }>()

const canContinue = computed(() => (props.pilot as any).TalentsController.HasFullTalents)
const count = computed(() => (props.pilot as any).TalentsController.MaxTalentPoints)
const word = computed(() => {
  const words = ['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen']
  return words[count.value] ?? count.value
})
</script>
