<template>
  <div v-if="item.Actions?.length"
    class="mb-2 mt-1">
    <cc-combat-action-chip v-for="a in item.Actions"
      :key="a.ID"
      :action="a"
      :owner="combatant"
      :encounter-instance="encounterInstance" />
  </div>
  <div v-if="item.Deployables?.length"
    class="mb-2">
    <deploy-button v-for="d in item.Deployables"
      :key="d.ID"
      :deployable="d"
      :actor="actor"
      @deploy="$emit('deploy', $event)" />
  </div>
</template>

<script setup lang="ts">
import type { ICombatant } from '@/classes/components/combat/ICombatant'
import type { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import type { CombatantData } from '@/classes/encounter/Encounter'
import DeployButton from './_components/loadouts/_deployButton.vue'

defineProps<{
  item: any
  combatant: CombatantData
  encounterInstance: EncounterInstance
  actor: ICombatant
}>()
defineEmits<{ deploy: [deployable: any] }>()
</script>
