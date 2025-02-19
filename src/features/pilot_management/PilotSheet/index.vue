<template>
  <div v-if="pilot">
    <pilot-header-mobile v-if="mobile" :pilot="pilot" />
    <pilot-header v-else :pilot="pilot" />
    <div :style="`padding-top: ${mobile ? '75px' : '100px'}`">
      <info-view v-if="page === 0" :pilot="pilot" />
      <narrative-view v-else-if="page === 1" :pilot="pilot" />
      <bonds-view v-else-if="page === 2" :pilot="pilot" />
      <tactical-view v-else-if="page === 3" :pilot="pilot" />
      <mech-hangar-view v-else-if="page === 4" :pilot="pilot" />
    </div>
    <pilot-nav-mobile v-if="mobile" :pilot="pilot" :selected="page" @to="page = $event" />
    <pilot-nav v-else :pilot="pilot" :selected="page" @to="page = $event" />
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
import PilotNavMobile from './components/PilotNavMobile.vue';

import NarrativeView from './sections/narrative/index.vue';
import InfoView from './sections/info/index.vue';
import TacticalView from './sections/tactical/index.vue';
import MechHangarView from './sections/hangar/index.vue';
import BondsView from './sections/bonds/index.vue';
import { UserStore } from '@/stores';
import PilotHeaderMobile from './components/PilotHeaderMobile.vue';

export default {
  name: 'pilot-sheet',
  components: {
    PilotHeader,
    PilotHeaderMobile,
    PilotNav,
    PilotNavMobile,
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
      if (!val) return;
      UserStore().User.SetView('pilotSheetPage', val);
    },
  },
  created() {
    this.page = parseInt(UserStore().User.View('pilotSheetPage', 0));
  },
  computed: {
    mobile() {
      return this.$vuetify.display.mdAndDown;
    },
    pilot() {
      return PilotStore().getPilotByID(this.pilotID);
    },
  },
};
</script>
