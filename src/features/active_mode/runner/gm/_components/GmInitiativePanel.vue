<template>
  <div v-if="expanded">
    <v-btn-group flat tile style="width: 100%; height: 20px" color="primary">
      <v-btn size="x-small" style="width: 25%" @click="sortBy('name')">
        <v-icon size="x-large" icon="mdi-format-text-variant" />
      </v-btn>
      <v-btn size="x-small" style="width: 25%" @click="sortBy('type')">
        <v-icon size="x-large" icon="cc:pilot" />
      </v-btn>
      <v-btn size="x-small" style="width: 25%" @click="sortBy('activations')">
        <v-icon size="x-large" icon="cc:activate" />
      </v-btn>
      <v-btn size="x-small" style="width: 25%" @click="sortBy('side')">
        <v-icon size="x-large" icon="mdi-flag" />
      </v-btn>
    </v-btn-group>
  </div>
  <sortable
    ref="sortable"
    :key="sortableKey"
    :sort="true"
    :list="actors"
    :options="{
      animation: 250,
      easing: 'cubic-bezier(1, 0, 0, 1)',
      handle: '.handle',
    }"
    item-key="index">
    <template #item="{ element, index }">
      <div class="my-2">
        <unit-runner-list-item
          v-if="element.type === 'unit' && element.npc"
          :combatant="element"
          :npc="element.npc"
          :collapsed="!expanded"
          :selected="selected && selected.id === element.id"
          @select="$emit('select', element)" />
      </div>
    </template>
  </sortable>

  <div style="height: 50px" />

  <div style="position: absolute; bottom: 0; left: 0; right: 0">
    <v-menu>
      <template #activator="{ props }">
        <v-btn
          v-if="expanded"
          v-bind="props"
          block
          flat
          tile
          color="primary"
          prepend-icon="mdi-plus">
          Add Item
        </v-btn>
        <v-btn v-else v-bind="props" icon block flat tile color="primary" height="36">
          <v-icon size="x-large" icon="mdi-plus" />
        </v-btn>
      </template>
      <v-card tile>
        <v-btn block border flat tile color="primary">Add Reinforcement</v-btn>
        <v-btn block border flat tile color="primary">Add Pilot</v-btn>
        <v-btn block border flat tile color="primary">Add Doodad</v-btn>
        <v-btn block border flat tile color="primary">Add Other</v-btn>
        <v-btn block border flat tile color="primary">Add Stub</v-btn>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import _ from 'lodash';

import { Sortable } from 'sortablejs-vue3';
import { CompendiumStore } from '@/stores';
import UnitRunnerListItem from './ListItems/UnitRunnerListItem.vue';

export default {
  name: 'gm-encounter-runner-initiative-panel',
  components: {
    Sortable,
    UnitRunnerListItem,
  },
  props: {
    encounter: {
      type: Object,
      required: true,
    },
    expanded: {
      type: Boolean,
      default: true,
    },
    selected: {
      type: Object,
      default: null,
    },
  },
  data: () => ({
    sort: '',
    sortableKey: `sk-0`,
    actors: [],
  }),
  emits: ['select'],
  mounted() {
    this.actors = this.encounter.Combatants;
  },
  methods: {
    async sortBy(key) {
      const sorted = _.orderBy(this.actors, key, this.sort === key ? 'desc' : 'asc');
      if (this.sort === key) sorted.reverse();
      this.sort = key;

      this.actors = sorted;
      this.sortableKey = `sk-${Math.floor(Math.random() * 1000)}`;
      await this.$forceUpdate();
    },
    selectActor(actor) {
      this.selected = actor;
      this.panel = null;
    },
    selectPanel(panel) {
      this.panel = panel;
    },
    getItem(combatant) {
      console.log('combatant:', combatant);
      if (combatant.type === 'unit') {
        return combatant.npc;
      }
      return null;
    },
  },
};
</script>
