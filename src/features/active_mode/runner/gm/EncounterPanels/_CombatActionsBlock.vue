<template>
  <div v-if="item.Actions?.length"
    class="mb-2 mt-1">
    <cc-combat-action-chip :owner="combatant" :encounter-instance="encounterInstance" v-for="a in item.Actions"
      :key="a.ID"
      :action="a" />
  </div>
  <div v-if="item.Deployables?.length"
    class="mb-2">
    <deploy-button v-for="(d, i) in item.Deployables"
      :key="`idx_${i}_${d.Name}`"
      :deployable="d"
      :actor="actor"
      @deploy="$emit('deploy', $event)" />
  </div>
</template>

<script setup lang="ts">
import type { ICombatant } from '@/classes/components/combat/ICombatant'
import { useEncounterContext } from './encounterContext'
import type { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import type { CombatantData } from '@/classes/encounter/Encounter'
import DeployButton from './_components/loadouts/_deployButton.vue'
import { Deployable } from '@/classes/components/feature/deployable/Deployable.js';
import { FrameTrait } from '@/classes/mech/components/frame/FrameTrait.js';
import { CoreBonus } from '@/classes/pilot/components/corebonus/CoreBonus.js';

const { encounterInstance } = useEncounterContext()

defineProps<{
  item: CoreBonus | FrameTrait
  combatant: CombatantData
  actor: ICombatant
}>()
defineEmits<{ deploy: [deployable: Deployable] }>()
</script>
