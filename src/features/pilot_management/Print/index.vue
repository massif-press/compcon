<template>
  <v-card
    tile
    flat
    light
    class="printable"
    style="width: 210mm; margin-left:auto; margin-right: auto;"
  >
    <div class="no-print" style="min-height: 48px!important" />
    <blank-pilot-print v-if="blank" />
    <pilot-print v-else-if="pilot" :pilot="pilot" />
    <div style="page-break-before: always;" />
    <blank-mech-print v-if="blank" />
    <mech-print v-else-if="mech" :mech="mech" />
    <print-footer />
    <div class="no-print" style="min-height: 60px!important" />
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import BlankPilotPrint from './BlankPilotPrint.vue'
import PilotPrint from './PilotPrint.vue'
import BlankMechPrint from './BlankMechPrint.vue'
import MechPrint from './MechPrint.vue'
import PrintFooter from './PrintFooter.vue'
import { getModule } from 'vuex-module-decorators'
import { PilotManagementStore } from '@/store'
import { Pilot } from '@/class'

export default Vue.extend({
  name: 'combined-print',
  components: { BlankPilotPrint, PilotPrint, BlankMechPrint, MechPrint, PrintFooter },
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
    if (this.pilotID === 'blank') this.blank = true
    this.pilot = getModule(PilotManagementStore, this.$store).Pilots.find(
      p => p.ID === this.pilotID
    )
    this.mech = !this.mechID ? null : (this.pilot as Pilot).Mechs.find(m => m.ID === this.mechID)
  },
})
</script>

<style>
.v-application .caption {
  line-height: normal !important;
}
</style>

<style scoped>
.printable {
  background-color: white !important;
}

@page {
  margin: 0;
  padding: 0;
}

@media print {
  @page {
    max-height: 100%;
    max-width: 210mm !important;
    margin: 0;
    padding: 0;
    color-adjust: exact !important;
    -webkit-print-color-adjust: exact !important;
    background-color: white;
  }

  .printable {
    /* zoom: 75%; */
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
