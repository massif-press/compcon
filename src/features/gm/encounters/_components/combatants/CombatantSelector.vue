<template>
  <combatant-selector-list-view v-if="mode === 'list'"
    :encounter="encounter"
    @select="$emit('select', $event)" />
</template>

<script lang="ts">
import CombatantSelectorListView from './views/CombatantSelectorListView.vue';

export default {
  name: 'UnitSelector',
  components: { CombatantSelectorListView },
  props: {
    mode: { type: String, default: 'list' },
    encounter: { type: Object, required: true },
  },
  emits: ['select'],
  data: () => ({
    selected: null,
  }),
};
</script>
