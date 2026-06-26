<template>
  <runner-list-item-base :actor="layer"
    :portrait="combatant.actor.Portrait"
    :deployed="combatant.deployables"
    :collapsed="collapsed"
    :selected="selected"
    :side="combatant.side"
    @click="$emit('select', combatant)"
    @deployable-click="$emit('select', $event)">
    <div>
      <span class="heading h4">
        {{ combatant.actor.Name }}
      </span>
      <cc-slashes class="ml-2" />
      <span class="heading h4 px-2 mx-2 bg-primary">
        {{ layer?.Name }}
      </span>
    </div>
  </runner-list-item-base>
</template>

<script setup lang="ts">
import type { CombatantData } from '@/classes/encounter/Encounter'
import { computed } from 'vue'
import RunnerListItemBase from './RunnerListItemBase.vue';

const props = withDefaults(defineProps<{
  combatant: CombatantData
  collapsed?: boolean
  selected?: boolean
}>(), {
  collapsed: false
})

const emit = defineEmits<{
  'select': [payload: any]
}>()

const layer = computed(() => {
      return props.combatant.actor.ActiveLayer;
    })
</script>
