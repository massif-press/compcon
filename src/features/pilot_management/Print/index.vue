<template>
  <v-card tile flat class="printable text-black" style="margin-left: auto; margin-right: auto">
    <div v-if="!selectedPilot">
      <blank-pilot-print />
      <div v-if="hasBondData" style="page-break-before: always" />
      <blank-bonds-print v-if="hasBondData" />
      <div style="page-break-before: always" />
    </div>
    <div v-else>
      <pilot-print v-if="selectedPilot" :pilot="selectedPilot" />
      <page-break />
      <div v-if="hasBondData" />
      <bonds-print v-if="selectedPilot.BondController.Bond" :bc="selectedPilot.BondController" />
    </div>
    <page-break />
    <mech-print v-if="selectedMech" :mech="selectedMech" />
    <blank-mech-print v-else />

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
      <options-dialog ref="options" @set="setOptions($event)" />
      <v-btn @click="print()">
        <span>Print</span>
        <v-icon icon="mdi-printer" />
      </v-btn>
    </v-bottom-navigation>
    <div class="no-print" style="min-height: 60px !important" />
  </v-card>
</template>

<script lang="ts">
import BlankPilotPrint from './BlankPilotPrint.vue';
import PilotPrint from './PilotPrint.vue';
import BlankBondsPrint from './BlankBondsPrint.vue';
import BondsPrint from './BondsPrint.vue';
import BlankMechPrint from './BlankMechPrint.vue';
import MechPrint from './MechPrint.vue';
import OptionsDialog from './OptionsDialog.vue';

import { PilotStore, CompendiumStore } from '@/stores';
import { Pilot, Mech } from '@/class';
import PageBreak from './components/PageBreak.vue';

export default {
  name: 'combined-print',
  components: {
    BlankPilotPrint,
    PilotPrint,
    BlankBondsPrint,
    BondsPrint,
    BlankMechPrint,
    MechPrint,
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
      return CompendiumStore().Bonds.length;
    },
  },
  methods: {
    print() {
      window.print();
    },
    setOptions(options) {
      console.log(options);
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
.printable {
  background-color: white !important;
  width: 210mm;
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
