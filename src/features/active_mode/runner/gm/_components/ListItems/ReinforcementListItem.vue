<template>
  <runner-list-item-base :actor="combatant.actor"
    :collapsed="collapsed"
    :selected="selected"
    :side="combatant.side"
    :icon="combatant.actor.Icon"
    is-reinforcement
    :reinforcement-turn="combatant.reinforcementTurn"
    :round="round"
    @activate="$emit('activate', combatant)"
    @click="$emit('select', combatant)">
    <div>
      <span class="heading h4">
        {{ combatant.actor.Name }}
      </span>
    </div>
  </runner-list-item-base>
</template>

<script setup lang="ts">
import type { CombatantData } from '@/classes/encounter/Encounter'
import RunnerListItemBase from './RunnerListItemBase.vue';

const props = withDefaults(defineProps<{
  combatant: CombatantData
  collapsed?: boolean
  selected?: boolean
  round?: number
}>(), {
  collapsed: false,
  round: 1
})

const emit = defineEmits<{
  'select': []
  'activate': []
}>()
</script>
