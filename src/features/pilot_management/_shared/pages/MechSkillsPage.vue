<template>
  <stepper-content :complete="canContinue"
    :mandatory="context === 'new'"
    :exit="context === 'new' ? '../pilot_management' : `/pilot/${pilot.ID}`"
    back
    @back="$emit('back')"
    @complete="$emit('next')">
    <cc-title offset>{{ context === 'new' ? $t('pm.shared.pilotMechSkills') : $t('pm.shared.improveMechSkills') }}&emsp;</cc-title>

    <div v-if="context === 'new'"
      class="heading h2">
      {{ $t('pm.new.uadIDENTService') }} <cc-slashes /> &nbsp;{{ $t('pm.shared.rm4dPilotSelfAssessment3') }}
    </div>
    <div v-else
      class="heading h2">
      {{ $t('pm.level.mv2LicenseAcquisitionRequest') }} <cc-slashes /> &nbsp;{{ $t('pm.shared.mv2CFrameConfigurationUpdate') }}
    </div>

    <p v-if="context === 'new'"
      class="flavor-text"
      style="font-size: 14px">
      {{ $t('pm.shared.theRM4bPILOTSELFASSESSMENT') }}
    </p>
    <p v-else
      class="flavor-text"
      style="font-size: 14px">
      {{ $t('pm.shared.onAcceptanceFrameConfig', { id: pilot.ID }) }}
    </p>

    <v-alert color="accent"
      variant="outlined"
      density="compact"
      class="mt-2"
      tile>
      <div class="heading">
        {{ context === 'new' ? $t('pm.shared.addMechSkillPoints', { word, count }) : $t('pm.shared.improveMechSkill') }}
      </div>
      <p class="text-cc-overline">
        {{ $t('pm.shared.bySubmittingThisFormYouAttest') }}
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
