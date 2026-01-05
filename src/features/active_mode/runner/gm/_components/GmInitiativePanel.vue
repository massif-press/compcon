<template>
  <div v-if="expanded" class="mb-1">
    <v-btn-group flat tile style="width: 100%; height: 20px" color="primary">
      <v-btn size="x-small" style="width: 25%" @click="itemSort('name')">
        <v-icon size="x-large" icon="mdi-format-text-variant" />
      </v-btn>
      <v-btn size="x-small" style="width: 25%" @click="itemSort('type')">
        <v-icon size="x-large" icon="cc:pilot" />
      </v-btn>
      <v-btn size="x-small" style="width: 25%" @click="itemSort('activations')">
        <v-icon size="x-large" icon="cc:activate" />
      </v-btn>
      <v-btn size="x-small" style="width: 25%" @click="itemSort('side')">
        <v-icon size="x-large" icon="mdi-flag" />
      </v-btn>
    </v-btn-group>
  </div>
  <sortable
    ref="sortable"
    :key="sortableKey"
    :sort="true"
    :list="activeCombatants"
    :options="{
      animation: 250,
      easing: 'cubic-bezier(1, 0, 0, 1)',
      handle: '.handle',
    }"
    item-key="index">
    <template #item="{ element, index }">
      <div class="mb-1">
        <placeholder-runner-list-item
          v-if="element.actor?.Placeholder"
          :combatant="element"
          :collapsed="!expanded"
          :selected="selected && selected.id === element.id"
          @select="$emit('select', $event)" />
        <component
          v-else
          :is="`${element.type}-runner-list-item`"
          :combatant="element"
          :collapsed="!expanded"
          :selected="selected && selected.id === element.id"
          @select="$emit('select', $event)" />
      </div>
    </template>
  </sortable>
  <v-card v-if="reinforcements.length" class="ma-2" flat tile color="background">
    <div v-if="expanded" class="text-cc-overline pa-1 text-disabled">
      <cc-slashes />
      reinforcements
    </div>

    <reinforcement-list-item
      v-for="r in reinforcements"
      :combatant="r"
      :collapsed="!expanded"
      :selected="selected && selected.id === r.id"
      :round="encounter.Round"
      no-drag
      @activate="activateReinforcement(r)"
      @select="$emit('select', $event)" />
  </v-card>

  <v-card v-if="destroyedCombatants.length" flat tile>
    <div v-if="expanded" class="text-cc-overline pa-1 text-disabled">
      <cc-slashes />
      Destroyed Combatants
    </div>
    <v-divider v-else class="my-2" />

    <destroyed-list-item
      v-for="r in destroyedCombatants"
      :combatant="r"
      :collapsed="!expanded"
      :selected="selected && selected.id === r.id"
      no-drag
      @select="$emit('select', $event)" />
  </v-card>

  <div style="height: 50px" />

  <div style="position: fixed; bottom: 35px; left: 0; width: 475px">
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
      <v-card tile border color="background">
        <gm-add-npc-menu :encounter-instance="encounter" />
        <v-divider />
        <gm-add-pc-menu :encounter-instance="encounter" />
        <v-divider />
        <gm-add-other-menu :encounter-instance="encounter" />
        <v-divider />
        <gm-add-stub-menu :encounter-instance="encounter" />
        <v-divider />
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import _, { round } from 'lodash';

import { Sortable } from 'sortablejs-vue3';
import { CompendiumStore } from '@/stores';
import UnitRunnerListItem from './ListItems/UnitRunnerListItem.vue';
import PilotRunnerListItem from './ListItems/PilotRunnerListItem.vue';
import DoodadRunnerListItem from './ListItems/DoodadRunnerListItem.vue';
import EidolonRunnerListItem from './ListItems/EidolonRunnerListItem.vue';
import GmAddNpcMenu from './ListItems/AddItems/GmAddNpcMenu.vue';
import GmAddPcMenu from './ListItems/AddItems/GmAddPcMenu.vue';
import GmAddOtherMenu from './ListItems/AddItems/GmAddOtherMenu.vue';
import GmAddStubMenu from './ListItems/AddItems/GmAddStubMenu.vue';
import PlaceholderRunnerListItem from './ListItems/PlaceholderRunnerListItem.vue';
import ReinforcementListItem from './ListItems/ReinforcementListItem.vue';
import DestroyedListItem from './ListItems/DestroyedListItem.vue';

export default {
  name: 'gm-encounter-runner-initiative-panel',
  components: {
    Sortable,
    UnitRunnerListItem,
    PilotRunnerListItem,
    DoodadRunnerListItem,
    GmAddNpcMenu,
    GmAddPcMenu,
    GmAddOtherMenu,
    GmAddStubMenu,
    PlaceholderRunnerListItem,
    ReinforcementListItem,
    EidolonRunnerListItem,
    DestroyedListItem,
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
    sortAsc: true,
    sortableKey: `sk-0`,
  }),
  emits: ['select'],

  computed: {
    combatants() {
      if (!this.encounter || !this.encounter.Combatants) {
        return [];
      }
      return this.encounter.Combatants.filter((c) => !c.actor.CombatController.IsDestroyed);
    },
    activeCombatants() {
      return this.combatants.filter((c) => !c.reinforcement);
    },
    reinforcements() {
      return this.combatants.filter((c) => c.reinforcement);
    },
    destroyedCombatants() {
      return this.encounter.Combatants.filter((c) => c.actor.CombatController.IsDestroyed);
    },
  },
  methods: {
    itemSort(key) {
      let sorted = [...this.combatants];

      if (key === 'name') {
        sorted.sort((a, b) =>
          (a.actor.Callsign || a.actor.Name).localeCompare(b.actor.Callsign || b.actor.Name)
        );
      } else if (key === 'type') {
        sorted.sort((a, b) => {
          if (a.actor.ItemType === 'Pilot') return -1;
          if (a.actor.ItemType === b.actor.ItemType) {
            return (a.actor.Callsign || a.actor.Name).localeCompare(
              b.actor.Callsign || b.actor.Name
            );
          }
          return a.actor.ItemType.localeCompare(b.actor.ItemType);
        });
      } else if (key === 'activations') {
        sorted.sort((a, b) => {
          const aVal = a.actor.CombatController?.StatController?.CurrentStats?.activations || -1;
          const bVal = b.actor.CombatController?.StatController?.CurrentStats?.activations || -1;
          return aVal - bVal;
        });
      } else if (key === 'side') {
        sorted.sort((a, b) => a.side.localeCompare(b.side));
      }

      if (this.sort === key) {
        this.sortAsc = !this.sortAsc;
      } else {
        this.sort = key;
        this.sortAsc = true;
      }

      if (!this.sortAsc) {
        sorted.reverse();
      }

      sorted.forEach((c, i) => {
        c.index = i;
      });

      this.combatants = sorted;
      this.sortableKey = `sk-${Math.floor(Math.random() * 1000)}`;
    },
    selectActor(actor) {
      this.selected = actor;
      this.panel = null;
    },
    selectPanel(panel) {
      this.panel = panel;
    },
    getItem(combatant) {
      if (combatant.type === 'unit') {
        return combatant.npc;
      }
      return null;
    },
    activateReinforcement(combatant) {
      combatant.reinforcement = false;
    },
  },
};
</script>
