<template>
  <stepper-content :complete="canContinue"
    :mandatory="context === 'new'"
    :exit="context === 'new' ? '../pilot_management' : `/pilot/${pilot.ID}`"
    back
    @back="$emit('back')"
    @complete="$emit('next')">
    <cc-title offset>{{ context === 'new' ? $t('compendium.categories.pilotTalents') : $t('pm.shared.improveTalents') }}&emsp;</cc-title>

    <div v-if="context === 'new'"
      class="heading h2">
      {{ $t('pm.new.uadIDENTService') }} <cc-slashes /> &nbsp;{{ $t('pm.shared.rm4cPilotSelfAssessment2') }}
    </div>
    <div v-else
      class="heading h2">
      {{ $t('pm.level.mv2LicenseAcquisitionRequest') }} <cc-slashes /> &nbsp;{{ $t('pm.shared.mv2BCOAResourceRequisition') }}
    </div>

    <p v-if="context === 'new'"
      class="flavor-text"
      style="font-size: 14px">
      {{ $t('pm.shared.theRM4bPILOTSELFASSESSMENT3') }}
    </p>
    <p v-else
      class="flavor-text"
      style="font-size: 14px">
      {{ $t('pm.shared.theCombatOperationAbilityRequisitionOn') }}
    </p>

    <v-alert color="accent"
      variant="outlined"
      density="compact"
      class="mt-2"
      tile>
      <div class="heading">
        {{ context === 'new' ? $t('pm.shared.selectPilotTalents', { word, count }) : $t('pm.shared.addOrUpgradeTalent') }}
      </div>
      <p class="text-cc-overline">
        {{ $t('pm.shared.bySubmittingThisFormYouAttest') }}
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
