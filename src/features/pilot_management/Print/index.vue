<template>
  <v-card
    tile
    flat
    :class="options.orientation"
    class="bg-white text-black mt-6"
    style="margin-left: auto; margin-right: auto"
  >
    <div>
      <component
        :is="options.layout"
        :options="options"
        :selected-mech="(selectedMech as Mech)"
        :selected-pilot="(selectedPilot as Pilot)"
        :hasBonds="hasBondData"
      />
    </div>
    <!-- {{ options }} -->
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
        style="width: 10vw"
      />
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
        style="width: 10vw"
      />
      <v-spacer />

      <v-btn @click="($refs as any).options.show()">
        <span>Options</span>
        <v-icon icon="mdi-cog" />
      </v-btn>
      <options-dialog ref="options" :hasBonds="hasBondData" @set="setOptions($event)" />
      <v-btn @click="print()">
        <span>Print</span>
        <v-icon icon="mdi-printer" />
      </v-btn>
    </v-bottom-navigation>
  </v-card>
  <div class="no-print" style="min-height: 70px !important" />
</template>

<script lang="ts">
import Expanded from './layouts/expanded/index.vue';
import Standard from './layouts/standard/index.vue';
import Terse from './layouts/terse/index.vue';
import Minimal from './layouts/minimal/index.vue';

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
    options: {} as any,
  }),
  created() {
    if (!this.presetPilot) return;
    if (this.presetPilot)
      this.selectedPilot = PilotStore().Pilots.find((p) => p.ID === this.presetPilot) as Pilot;
    if (this.presetMech)
      this.selectedMech = this.selectedPilot?.Mechs.find((m) => m.ID === this.presetMech) || null;
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

@page {
  margin: 0;
  padding: 0;
}

@media print {
  @page {
    max-height: 100%;
    width: 100% !important;
    max-width: 100% !important;
    margin: 0;
    padding: 0;
    color-adjust: exact !important;
    -webkit-print-color-adjust: exact !important;
    background-color: white;
  }

  .printable {
    /* zoom: 75%; */
    width: 100% !important;
    max-width: 100% !important;

    margin: 0 !important;
    padding: 0 !important;
    print-color-adjust: exact !important;
    -webkit-print-color-adjust: exact !important;
  }
  .caption {
    line-height: normal;
  }
  fieldset {
    padding: 0px;
    border-style: solid;
  }
}
</style>
