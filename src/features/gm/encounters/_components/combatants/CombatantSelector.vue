<template>
  <combatant-selector-list-view v-if="mode === 'list'" @select="$emit('select', $event)" />
  <combatant-selector-table-view v-else @select="$emit('select', $event)" />
</template>

<script lang="ts">
import { NpcStore } from '@/stores';
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
    itemTypes: ['unit', 'doodad', 'eidolon'],
  }),
  computed: {
    npcs() {
      return NpcStore().Npcs;
    },
    folders() {
      return NpcStore().getFolders;
    },
    filteredNpcs() {
      return this.npcs.filter((n) => this.itemTypes.includes(n.ItemType.toLowerCase()));
    },
  },
};
</script>
