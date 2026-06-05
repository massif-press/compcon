<template>
  <div v-if="item">
    <div v-if="item.Effect">
      <p v-html-safe="item.Effect"
        class="mb-1 px-2" />
    </div>

    <ActionsDeployables :item="item"
      :actor="pilot"
      action-icon="cc:weapon"
      @deploy="$emit('deploy', $event)" />

    <v-row dense
      align="center">
      <v-col cols="auto">
        <cc-tags v-if="item.Tags"
          combat
          :tags="item.Tags"
          color="pilot"
          :bonus="pilot.LimitedBonus" />
      </v-col>
      <v-col cols="auto"
        class="ml-auto mr-4">
        <cc-bonus :bonuses="item.Bonuses"
          chip />
        <cc-bonus :bonuses="externalPilotItemBonuses(pilot, item)" />

      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import type { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import { useEncounterContext } from '../../encounterContext'
import type { CombatantData } from '@/classes/encounter/Encounter'
import type { Pilot } from '@/classes/pilot/Pilot'
import ActionsDeployables from './_ActionsDeployables.vue'
import { externalPilotItemBonuses } from '@/composables/useExternalItemBonuses'
import { PilotEquipment } from '@/classes/pilot/components/Loadout/equipment/PilotEquipment'

const { owner, encounterInstance } = useEncounterContext()

defineProps<{
  item: PilotEquipment
  pilot: Pilot
}>()

defineEmits<{
  'deploy': [value: any]
}>()
</script>
