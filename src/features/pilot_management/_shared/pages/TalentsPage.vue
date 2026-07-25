<template>
  <stepper-content :complete="canContinue"
    :mandatory="context === 'new'"
    :exit="context === 'new' ? '../pilot_management' : `/pilot/${pilot.ID}`"
    back
    @back="$emit('back')"
    @complete="$emit('next')">
    <cc-title offset>{{ context === 'new' ? $t('common.pilotTalents') :
      $t('pm.shared.improveTalents') }}&emsp;</cc-title>

    <div v-if="!smAndDown"
      class="px-4">

      <div v-if="context === 'new'"
        class="heading h2">
        {{ $t('pm.new.uadIDENTService') }} <cc-slashes /> &nbsp;{{
          $t('pm.shared.rm4cPilotSelfAssessment2') }}
      </div>
      <div v-else
        class="heading h2">
        {{ $t('pm.level.mv2LicenseAcquisitionRequest') }} <cc-slashes /> &nbsp;{{
          $t('pm.shared.mv2BCOAResourceRequisition') }}
      </div>

      <p v-if="context === 'new'"
        class="flavor-text px-6"
        style="font-size: 14px">
        {{ $t('pm.shared.theRM4bPILOTSELFASSESSMENT3') }}
      </p>
      <p v-else
        class="flavor-text px-6"
        style="font-size: 14px">
        {{ $t('pm.shared.theCombatOperationAbilityRequisitionOn') }}
      </p>

      <v-alert color="accent"
        variant="outlined"
        density="compact"
        class="mt-2"
        tile>
        <div class="heading">
          {{ context === 'new' ? $t('pm.shared.selectPilotTalents', { word, count }) :
            $t('pm.shared.addOrUpgradeTalent') }}
        </div>
        <p class="text-cc-overline">
          {{ $t('pm.shared.bySubmittingThisFormYouAttest') }}
        </p>
      </v-alert>
    </div>
    <div v-if="context === 'level'"
      style="height: calc(100vh - 80px)">

      <div v-fill-height>
        <talent-selector :pilot="<Pilot>pilot" />

      </div>
    </div>
    <div v-else
      v-fill-height>
      <talent-selector :pilot="<Pilot>pilot" />
    </div>
  </stepper-content>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import StepperContent from '../../_components/StepperContent.vue'
import TalentSelector from '../../_components/selectors/TalentSelector.vue'
import vFillHeight from '../vFillHeight'
import { Pilot } from '@/classes/pilot/Pilot'
import { useDisplay } from 'vuetify'

const { smAndDown } = useDisplay()


const props = defineProps<{
  pilot: Pilot
  context: 'new' | 'level'
}>()

defineEmits<{ back: []; next: [] }>()

const canContinue = computed(() => (props.pilot as any).TalentsController.HasFullTalents)
const count = computed(() => (props.pilot as any).TalentsController.MaxTalentPoints)
const word = computed(() => {
  const words = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen']
  return words[count.value] ?? count.value
})
</script>
