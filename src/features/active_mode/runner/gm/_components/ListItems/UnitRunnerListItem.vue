<template>
  <runner-list-item-base :actor="combatant.actor"
    :portrait="getPortrait"
    :icon="combatant.actor.Icon"
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
      <span v-if="combatant.number"
        class="text-accent ml-2">#{{ combatant.number }}</span>
    </div>
    <div class="text-cc-overline">
      T{{ combatant.actor.NpcClassController.Tier }}
      {{ combatant.actor.NpcClassController.Class.Name }}
      <span v-if="combatant.actor.NpcTemplateController.Templates.length">
        {{combatant.actor.NpcTemplateController.Templates.map((x) => x.Name).join(' / ')}}
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
  'select': []
}>()

const getPortrait = computed(() => {
      if (props.combatant.actor.PortraitController.HasImage)
        return props.combatant.actor.Portrait || '';
      return '';
    })
</script>
