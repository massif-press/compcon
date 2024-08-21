<template>
  <div v-if="pilot">
    <pilot-header :pilot="pilot" />
    <div style="padding-top: 100px">
      <info-view v-if="page === 0" :pilot="pilot" />
      <narrative-view v-else-if="page === 1" :pilot="pilot" />
      <bonds-view v-else-if="page === 2" :pilot="pilot" />
      <tactical-view v-else-if="page === 3" :pilot="pilot" />
      <mech-hangar-view v-else-if="page === 4" :pilot="pilot" />
    </div>
    <pilot-nav :pilot="pilot" :selected="page" @to="page = $event" />
    <v-spacer style="min-height: 80px" />
  </div>
  <div v-else>
    <h1 style="margin-top: 50px; text-align: center">ERROR // INVALID PILOT</h1>
  </div>
</template>

<script lang="ts">
import PilotHeader from './components/PilotHeader.vue';
import { PilotStore } from '../store';

import PilotNav from './components/PilotNav.vue';

import NarrativeView from './sections/narrative/index.vue';
import InfoView from './sections/info/index.vue';
import TacticalView from './sections/tactical/index.vue';
import MechHangarView from './sections/hangar/index.vue';
import BondsView from './sections/bonds/index.vue';

export default {
  name: 'pilot-sheet',
  components: {
    PilotHeader,
    PilotNav,
    NarrativeView,
    InfoView,
    TacticalView,
    MechHangarView,
    BondsView,
  },
  props: {
    pilotID: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    page: 0,
  }),
  watch: {
    page(val) {
      localStorage.setItem('cc_pilot_sheet_page', val.toString());
    },
  },
  mounted() {
    const setPage = localStorage.getItem('cc_pilot_sheet_page');
    if (setPage) this.page = parseInt(setPage);
  },
  computed: {
    pilot() {
      return PilotStore().getPilotByID(this.pilotID);
    },
  },
};
</script>
