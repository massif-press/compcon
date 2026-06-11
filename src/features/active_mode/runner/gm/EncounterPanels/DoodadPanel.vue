<template>
  <panel-base
    :item="combatant.actor">
    <template #name-block>
      <div class="heading h2">{{ combatant.actor.Name }}</div>
      <div class="text-cc-overline">{{ $t('active.addOther.doodad') }}</div>
    </template>
  </panel-base>
</template>

<script setup lang="ts">
import type { CombatantData } from '@/classes/encounter/Encounter'
import type { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import { computed, provide } from 'vue'
import { EncounterContextKey } from './encounterContext';
import PanelBase from './_PanelBase.vue';

const props = defineProps<{
  combatant: CombatantData
  encounterInstance: EncounterInstance
}>()

provide(EncounterContextKey, {
  owner: computed(() => props.combatant),
  encounterInstance: computed(() => props.encounterInstance),
})

const emit = defineEmits<{
  'deselect': []
}>()
</script>
