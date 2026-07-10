<template>
  <stepper-content :complete="canContinue"
    :mandatory="context === 'new'"
    :exit="context === 'new' ? '../pilot_management' : `/pilot/${pilot.ID}`"
    back
    @back="$emit('back')"
    @complete="$emit('next')">
    <cc-title :large="context === 'level'"
      offset>
      {{ context === 'new' ? $t('common.pilotTalents') : $t('pm.shared.addCOREBonus') }}&emsp;
    </cc-title>

    <div v-if="!smAndDown"
      class="px-4">

      <div v-if="context === 'new'"
        class="heading h2">
        {{ $t('pm.new.uadIDENTService') }} <cc-slashes /> &nbsp;{{
          $t('pm.shared.rm4cS2CoreModification') }}
      </div>
      <div v-else
        class="heading h2">
        {{ $t('pm.level.mv2LicenseAcquisitionRequest') }} <cc-slashes /> &nbsp;{{
          $t('pm.shared.mv2ACORESupplemental') }}
      </div>

      <p v-if="context === 'new'"
        class="flavor-text px-6"
        style="font-size: 14px">
        {{ $t('pm.shared.theRM4SupplementalIICore') }}
      </p>
      <p v-else
        class="flavor-text px-6"
        style="font-size: 14px">
        {{ $t('pm.shared.theMV2ASupplementalAmendment') }}
      </p>

      <v-alert color="accent"
        variant="outlined"
        density="compact"
        class="mt-2"
        tile>
        <div class="heading">
          {{ context === 'new'
            ? $t('pm.shared.selectCoreBonusesN', {
              word, count, item: count > 1 ?
                $t('pm.shared.bonusesWord') : $t('common.bonus')
            })
            : $t('pm.shared.selectACoreBonus') }}
        </div>
        <p class="text-cc-overline">
          {{ $t('pm.shared.theUnionLicensingAuthorityAndThe') }}
        </p>
      </v-alert>
    </div>

    <template v-if="context === 'level'">
      <div v-fill-height>
        <core-bonus-selector v-if="cbEligible"
          :pilot="pilot" />
        <v-card v-else
          flat
          tile
          color="panel">
          <v-card-text class="flavor-text text-center py-5 px-3">
            <span class="heading h2 text-disabled">{{ $t('pm.shared.pilotINELIGIBLEFORCOREBONUS')
            }}</span>
            <br />
            <span class="text-disabled">{{ $t('pm.shared.nextCoreBonusIn') }} {{ 3 - (pilot.Level %
              3)
            }} {{ $t('pm.shared.licenseLevels') }}</span>
          </v-card-text>
        </v-card>
      </div>
    </template>
    <div v-else
      v-fill-height
      class="pb-4">
      <core-bonus-selector :pilot="<Pilot>pilot" />
    </div>
  </stepper-content>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import StepperContent from '../../_components/StepperContent.vue'
import CoreBonusSelector from '../../_components/selectors/CoreBonusSelector.vue'
import vFillHeight from '../vFillHeight'
import { Pilot } from '@/classes/pilot/Pilot'
import { useDisplay } from 'vuetify'

const { smAndDown } = useDisplay()

const props = defineProps<{
  pilot: Pilot
  context: 'new' | 'level'
  cbEligible?: boolean
}>()

const emit = defineEmits<{ back: []; next: [] }>()

const canContinue = computed(() =>
  props.context === 'new'
    ? (props.pilot as any).CoreBonusController.HasCBs
    : !(props.pilot as any).CoreBonusController.IsMissingCBs
)
const count = computed(() => (props.pilot as any).CoreBonusController.MaxCBPoints)
const word = computed(() => {
  const words = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen']
  return words[count.value] ?? count.value
})
</script>
