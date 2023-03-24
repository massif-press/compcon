<template>
  <v-card
    tile
    flat
    light
    class="printable"
    style="margin-left: auto; margin-right: auto"
  >
    <div v-if="blank">
      <blank-pilot-print />
      <div v-if="hasBondData" style="page-break-before: always" />
      <blank-bonds-print v-if="hasBondData" />
      <div style="page-break-before: always" />
      <blank-mech-print />
    </div>
    <div v-else>
      <pilot-print v-if="pilot" :pilot="pilot" />
      <div v-if="hasBondData" style="page-break-before: always" />
      <bonds-print
        v-if="hasBondData && pilot.BondController.Bond"
        :bc="pilot.BondController"
      />
      <div style="page-break-before: always" />
      <mech-print v-if="mech" :mech="mech" />
    </div>
    <print-footer />
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
import PrintFooter from './PrintFooter.vue';

import { PilotManagementStore, CompendiumStore } from '@/store';
import { Pilot } from '@/class';

export default {
  name: 'combined-print',
  components: {
    BlankPilotPrint,
    PilotPrint,
    BlankBondsPrint,
    BondsPrint,
    BlankMechPrint,
    MechPrint,
    PrintFooter,
  },
  props: {
    pilotID: {
      type: String,
      required: true,
    },
    mechID: {
      type: String,
      required: false,
      default: '',
    },
  },
  data: () => ({
    pilot: null,
    mech: null,
    blank: false,
  }),
  created() {
    if (this.pilotID === 'blank') this.blank = true;
    this.pilot = this.getModule(PilotManagementStore).Pilots.find(
      (p) => p.ID === this.pilotID
    );
    this.mech =
      !this.mechID || this.mechID === 'blank'
        ? null
        : (this.pilot as Pilot).Mechs.find((m) => m.ID === this.mechID);
  },
  computed: {
    hasBondData() {
      return this.getModule(CompendiumStore).Bonds.length;
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
    color-adjust: exact !important;
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
