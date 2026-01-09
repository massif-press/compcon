<template>
  <div :key="instanceID" v-if="!instance">
    <v-progress-linear indeterminate color="primary" height="20" class="my-5" />
    <div class="text-center text-cc-overline">Loading encounter instance...</div>
  </div>
  <div v-else>
    <div style="overflow-y: hidden">
      <v-layout :style="`height: calc(100vh - ${$vuetify.display.xs ? '23px' : '41px'})`">
        <div
          style="position: absolute; z-index: 999"
          :style="`left: ${showLeft ? '450' : '84'}px; top: 5px`">
          <cc-button
            :icon="showLeft ? 'mdi-chevron-double-left' : 'mdi-chevron-double-right'"
            size="small"
            color="primary"
            @click="showLeft = !showLeft" />
        </div>
        <div
          location="left"
          class="bg-background border-sm"
          style="position: absolute; z-index: 3; height: calc(100vh - 76px); overflow-y: auto">
          <gm-initiative-panel
            :encounter="instance"
            :selected="selected"
            :expanded="showLeft"
            @select="selectActor($event)" />
        </div>

        <v-main style="overflow-y: scroll" :style="`padding-left:${mainLeftOffset}`">
          <div class="text-center bg-panel pa-1 heading h3">
            {{ instance.Name }} &mdash; Round {{ instance.Round }}
          </div>
          <v-container>
            <div v-if="panel && instance">
              <component
                :is="`${panel}-panel`"
                :key="panel"
                :encounter="instance.Encounter"
                :selected="selected"
                :encounter-instance="instance" />
            </div>
            <div v-else>
              <component
                :is="`${selected.type}-panel`"
                :key="selected.id"
                :combatant="selected"
                :encounter-instance="instance"
                @deselect="selectActor($event)" />
              <actor-logs :actor="selected.actor" />
            </div>
          </v-container>
        </v-main>
        <div
          v-if="!mobile"
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
            :selected="panel"
            @selectPanel="selectPanel"
            @openDiceRoller="diceDialog = true"
            @openTableIndex="tableDialog = true" />
        </v-navigation-drawer>
        <v-footer app height="36" style="border-top: 1px solid rgba(255, 255, 255, 0.1)">
          <v-row justify="space-between" align="center" no-gutters>
            <v-col>
              <gm-end-round-panel :encounter-instance="instance" />
            </v-col>
            <v-col>
              <gm-end-encounter-panel :encounter-instance="instance" />
            </v-col>
          </v-row>
        </v-footer>
      </v-layout>
    </div>
    <v-dialog v-model="diceDialog" max-height="80vh" max-width="80vw">
      <gm-dice-roller @close="diceDialog = false" :selected="selected" />
    </v-dialog>

    <v-dialog v-model="tableDialog" max-width="80vw">
      <rollable-table-index
        :instance="instance"
        @close="tableDialog = false"
        :selected="selected" />
    </v-dialog>
  </div>
</template>

<script>
import _ from 'lodash';

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
import EidolonPanel from './EncounterPanels/EidolonPanel.vue';
import ActorLogs from './EncounterPanels/_components/ActorLogs.vue';

export default {
  name: 'gm-encounter-runner',
  components: {
    GmInitiativePanel,
    Sortable,
    DeployablePanel,
    DoodadPanel,
    EidolonPanel,
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
    ActorLogs,
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
  props: {
    id: {
      type: String,
      required: false,
      default: null,
    },
  },
  mounted() {
    if (this.mobile) {
      this.showLeft = false;
      this.showRight = false;
    }
  },
  computed: {
    mobile() {
      return this.$vuetify.display.mdAndDown;
    },
    instance() {
      return EncounterStore().getActiveEncounter(
        this.id || this.$route.params.id || EncounterStore().CurrentActiveID
      );
    },
    instanceID() {
      return this.instance ? this.instance.ID : null;
    },
    actors() {
      if (!this.instance) return [];
      return this.instance.Combatants.map((c) => c.actor);
    },
    actorCount() {
      return this.actors.length;
    },
    mainLeftOffset() {
      // '485px' : '72px'
      if (!this.mobile && this.showLeft) return '485px';
      return '72px';
    },
  },
  watch: {
    instanceID: {
      immediate: true,
      handler(oldval, newval) {
        if (!newval) return;
        this.setEidolonHp();
      },
      deep: true,
    },
    actorCount(newval, oldval) {
      if (this.instance && newval > 0 && newval !== oldval) this.setEidolonHp();
    },
  },
  methods: {
    setEidolonHp() {
      this.playerCount = this.instance.Combatants.filter((c) => c.type === 'pilot').length;
      this.instance.Combatants.filter((c) => c.type === 'eidolon').forEach((e) =>
        e.actor.SetLayerHp(
          this.playerCount,
          e.actor.StatController.CurrentStats.hp === e.actor.StatController.MaxStats.hp
        )
      );
    },
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
