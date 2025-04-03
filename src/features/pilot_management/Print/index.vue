<template>
  <div class="printable">
    <v-card
      tile
      flat
      :class="options.orientation"
      class="print-card"
      style="margin-left: auto; margin-right: auto">
      <div>
        <component
          :is="options.layout"
          :options="options"
          :selected-mech="<Mech>selectedMech"
          :selected-pilot="<Pilot>selectedPilot"
          :hasBonds="hasBondData" />
        <div v-if="selectedPilot && options && options.extras">
          <combat-ref v-if="options.extras.includes('combat quick reference')" />
          <action-ref v-if="options.extras.includes('action reference')" />
          <downtime-ref v-if="options.extras.includes('downtime quick reference')" />
          <trigger-info-print
            v-if="options.extras.includes('relevant trigger reference')"
            :pilot="<Pilot>selectedPilot" />
          <tag-info-print
            v-if="options.extras.includes('relevant tag reference')"
            :pilot="<Pilot>selectedPilot"
            :mech="<Mech>selectedMech" />
        </div>
      </div>

      <v-bottom-navigation fixed grow horizontal color="primary" class="no-print pa-2">
        <v-btn stacked @click="$router.go(-1)">
          <span>Close Preview</span>
          <v-icon icon="mdi-close" />
        </v-btn>
        <v-select
          v-model="selectedPilot"
          :items="allPilots"
          :item-title="(x: Pilot) => `${x.Name} // ${x.Callsign}`"
          return-object
          density="compact"
          hide-details
          variant="outlined"
          label="Pilot"
          class="mx-3"
          clearable
          style="width: 10vw" />
        <v-select
          v-model="selectedMech"
          :items="pilotMechs"
          :item-title="(x: Mech) => `${x.Name} // ${x.Frame.Name}`"
          return-object
          density="compact"
          hide-details
          variant="outlined"
          label="Mech"
          class="mx-3"
          clearable
          style="width: 10vw" />
        <v-spacer />

        <cc-modal>
          <template #activator="{ open }">
            <v-btn @click="open">
              <span>Options</span>
              <v-icon icon="mdi-cog" />
            </v-btn>
          </template>
          <options-dialog :has-bonds="hasBondData" @set="setOptions($event)" />
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
import Expanded from './layouts/expanded/index.vue';
import Standard from './layouts/standard/index.vue';
import Terse from './layouts/terse/index.vue';
import Minimal from './layouts/minimal/index.vue';
import Cards from './layouts/cards/index.vue';

import TagInfoPrint from './extras/TagInfoPrint.vue';
import TriggerInfoPrint from './extras/TriggerInfoPrint.vue';
import CombatRef from './extras/CombatRef.vue';
import ActionRef from './extras/ActionRef.vue';
import DowntimeRef from './extras/DowntimeRef.vue';

import OptionsDialog from './OptionsDialog.vue';

import { PilotStore, CompendiumStore } from '@/stores';
import { Pilot, Mech } from '@/class';
import PageBreak from './components/PageBreak.vue';

export default {
  name: 'combined-print',
  components: {
    Standard,
    Terse,
    Minimal,
    Expanded,
    OptionsDialog,
    PageBreak,
    TagInfoPrint,
    TriggerInfoPrint,
    CombatRef,
    ActionRef,
    DowntimeRef,
    Cards,
  },
  props: {
    presetPilot: {
      type: String,
      required: true,
    },
    presetMech: {
      type: String,
      required: false,
      default: '',
    },
  },
  data: () => ({
    selectedPilot: null as Pilot | null,
    selectedMech: null as Mech | null,
    blank: false,
    options: {
      layout: { title: 'Standard', icon: 'mdi-book-open' },
      orientation: { title: 'Portrait', icon: 'mdi-file' },
      content: { title: 'Pilot', icon: 'cc:pilot' },
      bonds: { title: 'Include', icon: 'mdi-link' },
      paper: { title: 'Letter', icon: 'mdi-text-box-check-outline' },
      pilotInclude: [],
      mechInclude: [],
      extras: [],
      card: [],
    } as any,
  }),
  mounted() {
    if (!this.presetPilot) return;
    if (this.presetPilot)
      this.selectedPilot = PilotStore().Pilots.find((p) => p.ID === this.presetPilot) as Pilot;
    if (this.presetMech)
      this.selectedMech = this.selectedPilot?.Mechs.find((m) => m.ID === this.presetMech) || null;
    this.setOptions(this.options);
  },
  computed: {
    allPilots() {
      return PilotStore().Pilots.filter((x) => !x.SaveController.IsDeleted);
    },
    pilotMechs() {
      return this.selectedPilot ? this.selectedPilot.Mechs : [];
    },
    hasBondData() {
      return CompendiumStore().Bonds.length > 0;
    },
  },
  methods: {
    print() {
      window.print();
    },
    setOptions(options) {
      if (!options) return;
      let out = {};
      for (const key in options) {
        if (Array.isArray(options[key])) {
          out[key] = options[key].map((x) => x.title.toLowerCase());
        } else {
          out[key] = options[key].title.toLowerCase();
        }
      }
      this.options = out;
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
.portrait {
  background-color: white !important;
  width: 210mm;
}

.landscape {
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
