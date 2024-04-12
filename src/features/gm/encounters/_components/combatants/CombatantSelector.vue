<template>
  <combatant-selector-list-view
    v-if="mode === 'list'"
    :encounter="encounter"
    @select="$emit('select', $event)" />
  <combatant-selector-table-view v-else :encounter="encounter" @select="$emit('select', $event)" />
</template>

<script lang="ts">
import CombatantSelectorListView from './views/CombatantSelectorListView.vue';
import CombatantSelectorTableView from './views/CombatantSelectorTableView.vue';

export default {
  name: 'unit-selector',
  components: { CombatantSelectorListView, CombatantSelectorTableView },
  emits: ['select'],
  props: {
    mode: { type: String, default: 'list' },
    encounter: { type: Object, required: true },
  },
  data: () => ({
    selected: null,
  }),
};
</script>
