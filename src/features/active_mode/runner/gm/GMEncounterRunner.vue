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
      <v-navigation-drawer :rail="!showLeft" :width="mobile ? 220 : 460" persistent>
        <gm-initiative-panel
          :encounter="instance.Encounter"
          :selected="selected"
          :expanded="showLeft"
          @select="selectActor($event)" />
      </v-navigation-drawer>

      <v-main style="overflow-y: scroll">
        <div class="text-center bg-panel pa-1 heading h3">example encounter &mdash; round 1</div>
        <v-container :style="`max-width: ${showRight ? 'calc(100% - 56px)' : 'calc(100% - 62px)'}`">
          <div v-if="panel && instance">
            <component :is="`${panel}-panel`" :key="panel" :encounter="instance.Encounter" />
          </div>
          <div v-else>
            <component :is="`${selected.type}-panel`" :key="selected.ID" :item="selected.npc" />
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

      <v-navigation-drawer
        :rail="!showRight"
        :width="mobile ? 220 : 250"
        location="right"
        persistent>
        <gm-tool-palette
          :expanded="showRight"
          @selectPanel="selectPanel"
          @openDiceRoller="diceDialog = true"
          @openTableIndex="tableDialog = true" />
      </v-navigation-drawer>
      <v-footer app height="36" style="border-top: 1px solid rgba(255, 255, 255, 0.1)">
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
  </div>
  <v-dialog v-model="diceDialog" max-width="800" height="525">
    <gm-dice-roller @close="diceDialog = false" />
  </v-dialog>

  <v-dialog v-model="tableDialog" max-width="80vw">
    <rollable-table-index @close="tableDialog = false" />
  </v-dialog>
</template>

<script>
import _ from 'lodash';

import exampleData from '@/assets/Example Encounter.json';

import { Sortable } from 'sortablejs-vue3';
import DeployablePanel from './EncounterPanels/DeployablePanel.vue';
import DoodadPanel from './EncounterPanels/DoodadPanel.vue';
import UnitPanel from './EncounterPanels/UnitPanel.vue';
import PcPanel from './EncounterPanels/PcPanel.vue';
import EncounterInfoPanel from './InfoPanels/EncounterInfoPanel.vue';
import ReferencePanel from './InfoPanels/ReferencePanel.vue';
import GmDiceRoller from './_components/GmDiceRoller.vue';
import ReferenceTagPanel from './InfoPanels/ReferenceTagPanel.vue';
import RollableTableIndex from './_components/RollableTableIndex.vue';
import QuickReferencePanel from './InfoPanels/QuickReferencePanel.vue';
import { CompendiumStore } from '@/stores';
import GmNotesPanel from './InfoPanels/GmNotesPanel.vue';
import { Encounter } from '@/classes/encounter/Encounter';
import { EncounterInstance } from '@/classes/encounter/EncounterInstance';
import GmInitiativePanel from './_components/GmInitiativePanel.vue';
import GmToolPalette from './_components/GmToolPalette.vue';

export default {
  name: 'gm-encounter-runner',
  components: {
    GmInitiativePanel,
    Sortable,
    DeployablePanel,
    DoodadPanel,
    UnitPanel,
    PcPanel,
    EncounterInfoPanel,
    ReferencePanel,
    GmDiceRoller,
    ReferenceTagPanel,
    RollableTableIndex,
    QuickReferencePanel,
    GmNotesPanel,
    GmToolPalette,
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
    actors: [],
  }),
  created() {
    this.instance = new EncounterInstance({
      itemType: 'EncounterInstance',
      id: 'example_encounter_instance-1',
      encounterData: exampleData,
    });
    // temp shim
    this.instance.Encounter.Combatants.forEach((c) => {
      if (c.type === 'unit') c.npc.StatController.resetCurrentStats();
    });
  },
  computed: {
    mobile() {
      return this.$vuetify.display.mdAndDown;
    },
    old_actors() {
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
          vulnerabilities: [],
          immunities: [],
          statuses: [],
          special: [],
          stats: {
            overshield: 2,
            overcharge: 1,
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
          vulnerabilities: [],
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
          vulnerabilities: [],
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
          vulnerabilities: [],
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
          statuses: [{ Name: 'Exposed' }],
          resistances: [],
          vulnerabilities: [],
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
          Icon: 'cc:drone',
          resistances: [],
          vulnerabilities: [],
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
          vulnerabilities: [],
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
