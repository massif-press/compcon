<template>
  <div class="printable">
    <v-card
      tile
      flat
      :class="options.orientation.title"
      class="print-card"
      style="margin-left: auto; margin-right: auto">
      <div v-if="selectedEncounter" class="pb-4">
        <layout :options="options" :encounter="selectedEncounter" />
        <div v-if="options && options.extras">
          <page-break v-if="options.extras.some((x) => x.title === 'GM Tracker')" />
          <gm-tracker
            v-if="options.extras.some((x) => x.title === 'GM Tracker')"
            :encounter="selectedEncounter" />
          <page-break v-if="options.extras.some((x) => x.title === 'Combat Quick Reference')" />
          <combat-ref v-if="options.extras.some((x) => x.title === 'Combat Quick Reference')" />
          <page-break v-if="options.extras.some((x) => x.title === 'Action Reference')" />
          <action-ref v-if="options.extras.some((x) => x.title === 'Action Reference')" />
          <page-break v-if="options.extras.some((x) => x.title === 'Tag Reference')" />
          <tag-info-print v-if="options.extras.some((x) => x.title === 'Tag Reference')" />
        </div>
      </div>

      <!-- {{ options }} -->
      <v-bottom-navigation fixed grow horizontal color="primary" class="no-print pa-2">
        <v-btn stacked @click="$router.go(-1)">
          <span>Close Preview</span>
          <v-icon icon="mdi-close" />
        </v-btn>
        <v-select
          v-model="selectedEncounter"
          :items="allEncounters"
          :item-title="(x: Encounter) => `${x.Name} `"
          return-object
          density="compact"
          hide-details
          variant="outlined"
          label="Encounter"
          class="mx-3"
          clearable />

        <v-spacer />

        <cc-modal title="Print Options" icon="mdi-cog">
          <template #activator="{ open }">
            <v-btn @click="open">
              <span>Options</span>
              <v-icon icon="mdi-cog" />
            </v-btn>
          </template>
          <options-dialog :options="options" />
        </cc-modal>
        <v-btn @click="print()">
          <span>Print</span>
          <v-icon icon="mdi-printer" />
        </v-btn>
      </v-bottom-navigation>
    </v-card>
    <div class="no-print" style="min-height: 70px !important" />
  </div>
</template>

<script lang="ts">
import Layout from './layout.vue';

import TagInfoPrint from './extras/TagInfoPrint.vue';
import CombatRef from './extras/CombatRef.vue';
import ActionRef from './extras/ActionRef.vue';
import GmTracker from './extras/GmTracker.vue';

import OptionsDialog from './OptionsDialog.vue';

import { EncounterStore } from '@/stores';
import PageBreak from './components/PageBreak.vue';
import { Encounter } from '@/classes/encounter/Encounter';

export default {
  name: 'combined-print',
  components: {
    Layout,
    OptionsDialog,
    PageBreak,
    TagInfoPrint,
    CombatRef,
    ActionRef,
    GmTracker,
  },
  props: {
    id: {
      type: String,
      required: false,
    },
  },
  data: () => ({
    selectedEncounter: null as Encounter | null,
    options: {
      layout: { title: 'Standard', icon: 'mdi-book-open' },
      orientation: { title: 'Portrait', icon: 'mdi-file' },
      paper: { title: 'Letter', icon: 'mdi-text-box-check-outline' },
      include: [],
      extras: [],
      card: [],
    },
  }),
  created() {
    if (!this.id) return;
    this.selectedEncounter = EncounterStore().Encounters.find((p) => p.ID === this.id) as Encounter;
  },
  computed: {
    allEncounters() {
      return EncounterStore().Encounters.filter((x) => !x.SaveController.IsDeleted);
    },
  },
  methods: {
    print() {
      window.print();
    },
  },
};
</script>

<style>
.v-application .caption {
  line-height: normal !important;
}
</style>

<style scoped>
.Portrait {
  background-color: white !important;
  width: 210mm;
}

.Landscape {
  background-color: white !important;
  width: 297mm;
}

.print-card {
  background-color: white;
  color: black;
  margin-top: 16px;
}

@page {
  margin: 0;
  padding: 0;
}

@media print {
  @page {
    size: portrait;
    width: 100% !important;
    max-width: 100% !important;
    margin: 0;
    padding: 0;
    color-adjust: exact !important;
    -webkit-print-color-adjust: exact !important;
    background-color: white !important;
    overflow: visible;
  }

  .print-card {
    margin: 0;
    padding: 0;
    width: 100% !important;
    overflow: visible;
  }

  .printable {
    /* zoom: 75%; */
    width: 100% !important;
    max-width: 100% !important;
    background-color: white;
    margin: 0 !important;
    padding: 0 !important;
    print-color-adjust: exact !important;
    -webkit-print-color-adjust: exact !important;
    overflow: visible;
  }
}
</style>
