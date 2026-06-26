<template>
  <runner-list-item-base :actor="combatant.actor"
    :collapsed="collapsed"
    :selected="selected"
    :side="combatant.side"
    :icon="combatant.actor.Icon"
    @click="$emit('select', combatant)">
    <div>
      <span class="heading h4">
        {{ combatant.actor.Name }}
      </span>
      <span v-if="combatant.actor.Mechname"
        class="text-overline ml-2">
        // {{ combatant.actor.Mechname }}
      </span>
    </div>
  </runner-list-item-base>
</template>

<script setup lang="ts">
import type { CombatantData } from '@/classes/encounter/Encounter'
import RunnerListItemBase from './RunnerListItemBase.vue';

defineOptions({ name: 'UnitRunnerListItem' })

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
