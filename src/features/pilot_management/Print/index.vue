<template>
  <div class="printable" style="width: 100%">
    <div class="no-print" style="min-height: 48px!important" />
    <blank-pilot-print v-if="blank" />
    <pilot-print v-else-if="pilot" :pilot="pilot" />
    <div style="page-break-before: always;" />
    <blank-mech-print v-if="blank" />
    <mech-print v-else-if="mech" :mech="mech" />
    <print-footer />
    <div class="no-print" style="min-height: 60px!important" />
  </div>
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
    console.log(this.pilot)
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
@page {
  size: A4;
  margin: 10px;
  color-adjust: exact !important;
  -webkit-print-color-adjust: exact !important;
  background-color: white;
}
@media print {
  .printable {
    zoom: 75%;
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
