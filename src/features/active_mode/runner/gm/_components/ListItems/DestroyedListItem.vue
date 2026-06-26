<template>
  <runner-list-item-base :actor="combatant.actor"
    :collapsed="collapsed"
    :selected="selected"
    :side="combatant.side"
    icon="cc:destroyed_outline"
    @click="$emit('select', combatant)">
    <div>
      <span class="heading">
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
}>(), {
  collapsed: false
})

const emit = defineEmits<{
  'select': [payload: CombatantData]
}>()
</script>
