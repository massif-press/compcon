<template>
  <stepper-content :complete="canContinue"
    :mandatory="context === 'new'"
    :exit="context === 'new' ? '../pilot_management' : `/pilot/${pilot.ID}`"
    back
    @back="$emit('back')"
    @complete="$emit('next')">
    <cc-title :large="context === 'level'"
      offset>
      {{ context === 'new' ? 'Pilot Talents' : 'Add CORE Bonus' }}&emsp;
    </cc-title>

    <div v-if="context === 'new'"
      class="heading h2">
      UAD IDENT Service <cc-slashes /> &nbsp;RM-4c (S-2) Core Modification Supplemental
    </div>
    <div v-else
      class="heading h2">
      MV-2 License Acquisition Request <cc-slashes /> &nbsp;MV-2(a) CORE Supplemental
    </div>

    <p v-if="context === 'new'"
      class="flavor-text"
      style="font-size: 14px">
      The RM-4β Supplemental II (Core Modification) registers a individual pilot's Core Modification
      Data (CMD) Archive to be made available for printing and outfitting services.
    </p>
    <p v-else
      class="flavor-text"
      style="font-size: 14px">
      The MV-2(a) Supplemental Amendment registers a major CORE modification, upgrade, retrofit, or
      enhancement. The Union Naval Intelligence Board only recognizes CORE augmentation from a
      Union-approved and registered Lincensor.
    </p>

    <v-alert color="accent"
      variant="outlined"
      density="compact"
      class="mt-2"
      tile>
      <div class="heading">
        {{ context === 'new'
          ? `Select ${word} (${count}) Core ${count > 1 ? 'Bonuses' : 'Bonus'}.`
          : 'Select a CORE Bonus' }}
      </div>
      <p class="text-cc-overline">
        The Union Licensing Authority and the Union Administration Department hereby disclaim any
        and all responsibility for Core Modifications.
      </p>
    </v-alert>

    <template v-if="context === 'level'">
      <core-bonus-selector v-if="cbEligible"
        level-up
        flat
        :pilot="pilot" />
      <v-card v-else
        flat
        tile
        color="panel">
        <v-card-text class="flavor-text text-center py-5 px-3">
          <span class="heading h2 text-disabled">PILOT INELIGIBLE FOR CORE BONUS</span>
          <br />
          <span class="text-disabled">NEXT CORE BONUS IN {{ 3 - (pilot.Level % 3) }} LICENSE LEVELS</span>
        </v-card-text>
      </v-card>
    </template>
    <core-bonus-selector v-else
      flat
      :pilot="<Pilot>pilot" />
  </stepper-content>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import StepperContent from '../../_components/StepperContent.vue'
import CoreBonusSelector from '../../_components/selectors/CoreBonusSelector.vue'
import { Pilot } from '@/classes/pilot/Pilot'

defineOptions({ name: 'core-bonus-page' })

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
  const words = ['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen']
  return words[count.value] ?? count.value
})
</script>
