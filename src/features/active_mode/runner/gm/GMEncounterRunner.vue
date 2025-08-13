<template>
  <div v-if="!instance">
    <v-progress-linear indeterminate color="primary" height="20" class="my-5" />
    <div class="text-center text-cc-overline">Loading encounter instance...</div>
  </div>
  <div v-else>
    <div
      class="bg-surface"
      style="position: absolute; top: -10px; right: -10px; width: 50px; height: 50px; z-index: 0" />
    <div style="overflow-y: hidden">
      <v-layout :style="`height: calc(100vh - ${mobile ? '23px' : '41px'})`">
        <div
          style="position: absolute; z-index: 999"
          :style="`left: ${showLeft ? '466' : '62'}px; top: 6px`">
          <cc-button
            :icon="showLeft ? 'mdi-chevron-double-left' : 'mdi-chevron-double-right'"
            size="small"
            color="primary"
            @click="showLeft = !showLeft" />
        </div>
        <v-navigation-drawer :rail="!showLeft" :width="460" permanent>
          <gm-initiative-panel
            :encounter="instance"
            :selected="selected"
            :expanded="showLeft"
            @select="selectActor($event)" />
        </v-navigation-drawer>

        <v-main style="overflow-y: scroll">
          <div class="text-center bg-panel pa-1 heading h3">
            {{ instance.Name }} &mdash; Round {{ instance.Round }}
          </div>
          <v-container
            :style="`max-width: ${showRight ? 'calc(100% - 56px)' : 'calc(100% - 62px)'}`">
            <div v-if="panel && instance">
              <component :is="`${panel}-panel`" :key="panel" :encounter="instance.Encounter" />
            </div>
            <div v-else>
              <component
                :is="`${selected.type}-panel`"
                :key="selected.id"
                :combatant="selected"
                :encounter-instance="instance"
                @deselect="selectActor($event)" />
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

        <v-navigation-drawer :rail="!showRight" :width="250" location="right" permanent>
          <gm-tool-palette
            :expanded="showRight"
            @selectPanel="selectPanel"
            @openDiceRoller="diceDialog = true"
            @openTableIndex="tableDialog = true" />
        </v-navigation-drawer>
        <v-footer app height="36" style="border-top: 1px solid rgba(255, 255, 255, 0.1)">
          <v-row justify="space-between" align="center" no-gutters>
            <v-col>
              <gm-end-round-panel :encounter="instance.Encounter" />
            </v-col>
            <v-col>
              <gm-end-encounter-panel :encounter="instance.Encounter" />
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
  </div>
</template>

<script>
import _ from 'lodash';

import exampleData from '@/assets/Example Encounter.json';
import examplePilotData from '@/assets/Example Pilot.json';

import { Sortable } from 'sortablejs-vue3';
import DeployablePanel from './EncounterPanels/DeployablePanel.vue';
import DoodadPanel from './EncounterPanels/DoodadPanel.vue';
import UnitPanel from './EncounterPanels/UnitPanel.vue';
import PilotPanel from './EncounterPanels/PcPanel.vue';
import EncounterInfoPanel from './InfoPanels/EncounterInfoPanel.vue';
import ReferencePanel from './InfoPanels/ReferencePanel.vue';
import GmDiceRoller from './_components/GmDiceRoller.vue';
import ReferenceTagPanel from './InfoPanels/ReferenceTagPanel.vue';
import RollableTableIndex from './_components/RollableTableIndex.vue';
import QuickReferencePanel from './InfoPanels/QuickReferencePanel.vue';
import { CompendiumStore, EncounterStore } from '@/stores';
import GmNotesPanel from './InfoPanels/GmNotesPanel.vue';
import { Encounter } from '@/classes/encounter/Encounter';
import { EncounterInstance } from '@/classes/encounter/EncounterInstance';
import GmInitiativePanel from './_components/GmInitiativePanel.vue';
import GmToolPalette from './_components/GmToolPalette.vue';
import GmEndRoundPanel from './EncounterPanels/_components/GmEndRoundPanel.vue';
import GmEndEncounterPanel from './EncounterPanels/_components/GmEndEncounterPanel.vue';
import OptionsPanel from './InfoPanels/GmOptionsPanel.vue';
import PlaceholderPanel from './EncounterPanels/PlaceholderPanel.vue';

export default {
  name: 'gm-encounter-runner',
  components: {
    GmInitiativePanel,
    Sortable,
    DeployablePanel,
    DoodadPanel,
    UnitPanel,
    PilotPanel,
    PlaceholderPanel,
    EncounterInfoPanel,
    ReferencePanel,
    GmDiceRoller,
    ReferenceTagPanel,
    RollableTableIndex,
    QuickReferencePanel,
    GmNotesPanel,
    GmToolPalette,
    GmEndRoundPanel,
    GmEndEncounterPanel,
    OptionsPanel,
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
    instance() {
      return EncounterStore().getCurrentActiveEncounter;
    },

    actors() {
      if (!this.instance) return [];
      return this.instance.Encounter.combatants.map((c) => c.actor);
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
      console.log('selectActor', actor);
      this.selected = actor;
      this.panel = null;
    },
    selectPanel(panel) {
      this.panel = panel;
    },
  },
};
</script>
