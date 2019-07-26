<template>
  <div>
    <v-layout column fill-height>
      <v-flex xs12 class="major-title text-xs-center">
        <span>DOWNTIME</span>
      </v-flex>
    </v-layout>
    <v-divider class="ma-2" dark />
    <div class="ma-2 pt-3">
      <dt-action action-id="action_poweratcost" class="mb-1" ref="atcost">
        <power-at-cost :pilot="pilot" @close="$refs.atcost.dialog = false" />
      </dt-action>
      <dt-action action-id="action_buysometime" class="mb-1" ref="buytime">
        <buy-time :pilot="pilot" @close="$refs.buytime.dialog = false" />
      </dt-action>
      <dt-action action-id="action_damndrink" class="mb-1" ref="damndrink">
        <damn-drink :pilot="pilot" @close="$refs.damndrink.dialog = false" />
      </dt-action>
      <dt-action action-id="action_creative" class="mb-1" ref="getcreative">
        <!-- <gather-information :pilot="pilot" @close="$refs.gatherinfo.dialog = false" /> -->
      </dt-action>
      <dt-action action-id="action_focused" class="mb-1" />
      <dt-action action-id="action_organized" class="mb-1" />
      <dt-action action-id="action_information" class="mb-1" ref="gatherinfo">
        <gather-information :pilot="pilot" @close="$refs.gatherinfo.dialog = false" />
      </dt-action>
      <dt-action action-id="action_connected" class="mb-1" ref="getconnected">
        <get-connected :pilot="pilot" @close="$refs.getconnected.dialog = false" />
      </dt-action>
      <dt-action action-id="action_scrounge" class="mb-1" ref="scrounge">
        <scrounge-barter :pilot="pilot" @close="$refs.scrounge.dialog = false" />
      </dt-action>
    </div>
    <v-divider class="ma-2" dark />
    <v-layout row wrap>
      <v-flex xs12>
        <v-btn block large color="amber darken-4" dark @click="$emit('end')">Begin Mission</v-btn>
      </v-flex>
    </v-layout>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import DtAction from './Downtime/DtAction.vue'
import PowerAtCost from './Downtime/PowerAtCost.vue'
import BuyTime from './Downtime/BuyTime.vue'
import DamnDrink from './Downtime/DamnDrink.vue'
import GatherInformation from './Downtime/GatherInformation.vue'
import GetConnected from './Downtime/GetConnected.vue'
import ScroungeBarter from './Downtime/ScroungeBarter.vue'

export default Vue.extend({
  name: 'downtime-sidebar',
  components: {
    DtAction,
    PowerAtCost,
    BuyTime,
    DamnDrink,
    GatherInformation,
    GetConnected,
    ScroungeBarter,
  },
  props: {
    pilot: Object,
    mech: Object,
    loadout: Object,
  },
})
</script>

