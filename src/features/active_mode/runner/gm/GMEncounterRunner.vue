<template>
  <div
    class="bg-surface"
    style="position: absolute; top: -10px; right: -10px; width: 50px; height: 50px; z-index: 0" />
  <div style="overflow-y: hidden">
    <v-layout :style="`height: calc(100vh - ${mobile ? '23px' : '41px'})`">
      <div
        style="position: absolute; z-index: 999"
        :style="`left: ${showLeft ? (mobile ? '222' : '466') : '62'}px; top: 6px`">
        <cc-button
          :icon="showLeft ? 'mdi-chevron-double-left' : 'mdi-chevron-double-right'"
          size="small"
          color="primary"
          @click="showLeft = !showLeft" />
      </div>
      <v-navigation-drawer :rail="!showLeft" :width="mobile ? 220 : 460">
        <div v-if="showLeft">
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
          item-key="ID">
          <template #item="{ element, index }">
            <v-tooltip>
              <template #activator="{ props }">
                <div class="my-2" v-bind="!showLeft && props">
                  <component
                    :is="`${element.type}-runner-list-item`"
                    :key="`${element.ID}-${index}`"
                    :item="element"
                    :collapsed="!showLeft"
                    @select="selectActor($event)" />
                </div>
              </template>
              {{ element.tooltip }}
            </v-tooltip>
          </template>
        </sortable>
        <div style="height: 50px" />

        <div style="position: absolute; bottom: 0; left: 0; right: 0">
          <v-menu>
            <template #activator="{ props }">
              <v-btn
                v-if="showLeft"
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
      </v-navigation-drawer>
      <v-main style="overflow-y: scroll">
        <div class="text-center bg-panel pa-1 heading h3">example encounter &mdash; round 1</div>
        <v-container :style="`max-width: ${showRight ? 'calc(100% - 56px)' : 'calc(100% - 62px)'}`">
          <div v-if="panel">
            <component :is="`${panel}-panel`" :key="panel" />
          </div>
          <div v-else>
            <component :is="`${selected.type}-panel`" :key="selected.ID" :item="selected" />
          </div>
        </v-container>
      </v-main>
      <div
        style="position: absolute; z-index: 999"
        :style="`right: ${showRight ? (mobile ? '222' : '256') : '62'}px; top: 6px`">
        <cc-button
          :icon="showRight ? 'mdi-chevron-double-right' : 'mdi-chevron-double-left'"
          size="small"
          color="primary"
          @click="showRight = !showRight" />
      </div>

      <v-navigation-drawer :rail="!showRight" :width="mobile ? 220 : 250" location="right">
        <v-list slim>
          <v-tooltip>
            <template #activator="{ props }">
              <v-list-item v-bind="!showRight && props" @click="diceDialog = true">
                <template #prepend>
                  <v-icon icon="mdi-dice-d20-outline" />
                </template>
                Dice Roller
              </v-list-item>
            </template>
            Dice Roller
          </v-tooltip>
          <v-tooltip>
            <template #activator="{ props }">
              <v-list-item v-bind="!showRight && props" @click="tableDialog = true">
                <template #prepend>
                  <v-icon icon="mdi-table-multiple" />
                </template>
                Rollable Tables
              </v-list-item>
            </template>
            Rollable Tables
          </v-tooltip>
          <v-divider class="my-2" />
          <v-tooltip>
            <template #activator="{ props }">
              <v-list-item v-bind="!showRight && props" @click="selectPanel('encounter-info')">
                <template #prepend>
                  <v-icon icon="cc:encounter" />
                </template>
                Encounter Info
              </v-list-item>
            </template>
            Encounter Info
          </v-tooltip>
          <v-tooltip>
            <template #activator="{ props }">
              <v-list-item v-bind="!showRight && props" @click="selectPanel('gm-notes')">
                <template #prepend>
                  <v-icon icon="mdi-card-bulleted-outline" />
                </template>
                GM Overview
              </v-list-item>
            </template>
            GM Overview
          </v-tooltip>
          <v-divider class="my-2" />
          <v-tooltip max-width="300">
            <template #activator="{ props }">
              <v-list-item v-bind="!showRight && props" @click="selectPanel('reference-tag')">
                <template #prepend>
                  <v-icon icon="mdi-tag" />
                </template>
                Tag Reference
              </v-list-item>
            </template>
            List tags present on characters or equipment in this encounter
          </v-tooltip>
          <v-tooltip>
            <template #activator="{ props }">
              <v-list-item v-bind="!showRight && props" @click="selectPanel('quick-reference')">
                <template #prepend>
                  <v-icon icon="mdi-format-list-group" />
                </template>
                Combat Quick Reference
              </v-list-item>
            </template>
            Combat Quick Reference
          </v-tooltip>
        </v-list>
        <div style="height: 50px" />
      </v-navigation-drawer>
      <v-footer app height="36">
        <v-row justify="space-between" align="center" no-gutters>
          <v-col cols="3">
            <v-btn
              flat
              block
              variant="text"
              color="accent"
              prepend-icon="mdi-star-four-points-box-outline"
              @click="$emit('endEncounter')">
              GM Overrides
            </v-btn>
          </v-col>
          <v-col cols="3">
            <v-btn
              flat
              block
              variant="text"
              color="accent"
              prepend-icon="mdi-clock-end"
              @click="$emit('endEncounter')">
              End Round
            </v-btn>
          </v-col>
          <v-col cols="3">
            <v-btn
              flat
              block
              variant="text"
              color="accent"
              prepend-icon="mdi-stop-circle-outline"
              @click="$emit('endEncounter')">
              End Encounter
            </v-btn>
          </v-col>
        </v-row>
      </v-footer>
    </v-layout>
    <v-dialog v-model="diceDialog" max-width="800" height="525">
      <gm-dice-roller @close="diceDialog = false" />
    </v-dialog>

    <v-dialog v-model="tableDialog" max-width="80vw">
      <rollable-table-index @close="tableDialog = false" />
    </v-dialog>
  </div>
</template>

<script>
import _ from 'lodash';
import DeployableRunnerListItem from './_components/DeployableRunnerListItem.vue';
import DoodadRunnerListItem from './_components/DoodadRunnerListItem.vue';
import NpcRunnerListItem from './_components/NpcRunnerListItem.vue';
import PcRunnerListItem from './_components/PcRunnerListItem.vue';
import { Sortable } from 'sortablejs-vue3';
import DeployablePanel from './EncounterPanels/DeployablePanel.vue';
import DoodadPanel from './EncounterPanels/DoodadPanel.vue';
import NpcPanel from './EncounterPanels/NpcPanel.vue';
import PcPanel from './EncounterPanels/PcPanel.vue';
import EncounterInfoPanel from './InfoPanels/EncounterInfoPanel.vue';
import GmNotesPanel from './InfoPanels/GmNotesPanel.vue';
import ReferencePanel from './InfoPanels/ReferencePanel.vue';
import GmDiceRoller from './_components/GmDiceRoller.vue';
import ReferenceTagPanel from './InfoPanels/ReferenceTagPanel.vue';
import RollableTableIndex from './_components/RollableTableIndex.vue';
import QuickReferencePanel from './InfoPanels/QuickReferencePanel.vue';
import { CompendiumStore } from '@/stores';

export default {
  name: 'gm-encounter-runner',
  components: {
    Sortable,
    PcRunnerListItem,
    NpcRunnerListItem,
    DeployableRunnerListItem,
    DoodadRunnerListItem,
    DeployablePanel,
    DoodadPanel,
    NpcPanel,
    PcPanel,
    EncounterInfoPanel,
    GmNotesPanel,
    ReferencePanel,
    GmDiceRoller,
    ReferenceTagPanel,
    RollableTableIndex,
    QuickReferencePanel,
  },
  data: () => ({
    selected: null,
    diceDialog: false,
    tableDialog: false,
    panel: 'encounter-info',
    sort: '',
    showLeft: true,
    showRight: false,
    sortableKey: `sk-0`,
  }),
  computed: {
    mobile() {
      return this.$vuetify.display.mdAndDown;
    },
    actors() {
      return [
        {
          type: 'pc',
          ID: '1',
          callsign: 'Omukama',
          name: 'Alice',
          tooltip: 'Omukama / IPS-N Lancaster (Alice)',
          mechname: 'Light Treason',
          frame: CompendiumStore().Frames.find((f) => f.Name === 'Lancaster'),
          side: 'ally',
          resistances: [],
          immunities: [],
          statuses: [],
          special: [],
          stats: {
            structure: { current: 4, max: 4 },
            armor: { current: 1, max: 1 },
            hp: { current: 9, max: 22 },
            reactor: { current: 3, max: 4 },
            heat: { current: 9, max: 11 },
            repair: { current: 2, max: 8 },
          },
          activations: 1,
        },
        {
          type: 'pc',
          ID: '2',
          callsign: 'Viscount',
          name: 'Bob',
          tooltip: 'Viscount / HORUS Goblin (Bob)',
          mechname: 'Anomalous Waveform',
          frame: CompendiumStore().Frames.find((f) => f.Name === 'Goblin'),
          side: 'ally',
          statuses: [],
          resistances: [],
          immunities: [],
          special: ['cascade'],
          stats: {
            structure: { current: 4, max: 4 },
            armor: { current: 0, max: 0 },
            hp: { current: 11, max: 18 },
            reactor: { current: 3, max: 4 },
            heat: { current: 2, max: 11 },
            repair: { current: 6, max: 8 },
          },
          activations: 0,
        },
        {
          type: 'pc',
          ID: '3',
          callsign: 'Rook',
          name: 'Charlie',
          tooltip: 'Rook / GMS Everest (Charlie)',
          mechname: 'Point of Entry',
          frame: CompendiumStore().Frames.find((f) => f.Name === 'Everest'),
          resistances: [],
          immunities: [],
          statuses: [],
          special: [],
          side: 'ally',
          stats: {
            structure: { current: 3, max: 4 },
            armor: { current: 0, max: 0 },
            hp: { current: 22, max: 22 },
            reactor: { current: 4, max: 4 },
            heat: { current: 0, max: 11 },
            repair: { current: 8, max: 8 },
          },
          activations: 1,
        },
        {
          type: 'npc',
          ID: '4',
          name: 'My NPC',
          number: 1,
          class: 'Archer',
          template: 'Veteran',
          role: 'Controller',
          tooltip: 'My NPC / Veteran Archer',
          side: 'enemy',
          resistances: [],
          immunities: [],
          statuses: [],
          special: [],

          stats: {
            structure: { current: 1, max: 2 },
            hp: { current: 22, max: 22 },
            reactor: { current: 2, max: 2 },
            heat: { current: 0, max: 11 },
            repair: { current: 8, max: 8 },
          },
          activations: 1,
        },
        {
          type: 'npc',
          ID: '5',
          name: 'My NPC',
          number: 2,
          class: 'Archer',
          template: 'Veteran',
          role: 'Controller',
          tooltip: 'My NPC / Veteran Archer',
          side: 'enemy',
          statuses: ['Exposed'],
          resistances: [],
          immunities: [],
          special: [],
          stats: {
            structure: { current: 1, max: 1 },
            hp: { current: 22, max: 22 },
            reactor: { current: 1, max: 1 },
            heat: { current: 0, max: 11 },
            repair: { current: 8, max: 8 },
          },
          activations: 0,
        },
        {
          type: 'deployable',
          ID: '5',
          name: 'A Deployable',
          number: 1,
          owner: 'Viscount',
          tooltip: "A Deployable #1 (Viscount's Deployable)",
          side: 'ally',
          resistances: [],
          immunities: [],
          statuses: [],
          special: [],
          stats: {
            hp: { current: 8, max: 8 },
          },
          activations: 1,
        },
        {
          type: 'npc',
          ID: '5',
          name: 'Another NPC',
          number: 1,
          class: 'Bombard',
          template: 'Grunt',
          role: 'Artillery',
          side: 'enemy',
          tooltip: 'Another NPC / Grunt Bombard',
          resistances: [],
          immunities: [],
          statuses: [],
          special: [],
          stats: {
            hp: { current: 1, max: 1 },
          },
          activations: 2,
        },
        {
          type: 'doodad',
          ID: '6',
          name: 'Terrain Item',
          tooltip: 'Terrain Item',
          stats: {
            hp: { current: 5, max: 20 },
          },
        },
      ];
    },
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
  },
};
</script>
