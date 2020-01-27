<template>
  <v-window-item>
    <span class="heading mech">DOWNTIME</span>
    <v-divider class="ma-2" />
    <div class="mx-3 pt-3">
      <dt-action ref="atcost" action-id="act_power_at_a_cost" class="mb-1">
        <power-at-cost :pilot="pilot" @close="$refs.atcost.dialog = false" />
      </dt-action>
      <dt-action ref="buytime" action-id="act_buy_some_time" class="mb-1">
        <buy-time :pilot="pilot" @close="$refs.buytime.dialog = false" />
      </dt-action>
      <dt-action ref="damndrink" action-id="act_get_a_damn_drink" class="mb-1">
        <damn-drink :pilot="pilot" @close="$refs.damndrink.dialog = false" />
      </dt-action>
      <dt-action ref="getcreative" action-id="act_get_creative" class="mb-1">
        <get-creative :pilot="pilot" @close="$refs.getcreative.dialog = false" />
      </dt-action>
      <dt-action ref="getfocused" action-id="act_get_focused" class="mb-1">
        <get-focused :pilot="pilot" @close="$refs.getfocused.dialog = false" />
      </dt-action>
      <dt-action ref="getorganized" action-id="act_get_organized" class="mb-1">
        <get-organized :pilot="pilot" @close="$refs.getorganized.dialog = false" />
      </dt-action>
      <dt-action ref="gatherinfo" action-id="act_gather_information" class="mb-1">
        <gather-information :pilot="pilot" @close="$refs.gatherinfo.dialog = false" />
      </dt-action>
      <dt-action ref="getconnected" action-id="act_get_connected" class="mb-1">
        <get-connected :pilot="pilot" @close="$refs.getconnected.dialog = false" />
      </dt-action>
      <dt-action ref="scrounge" action-id="act_scrounge_and_barter" class="mb-1">
        <scrounge-barter :pilot="pilot" @close="$refs.scrounge.dialog = false" />
      </dt-action>
    </div>
    <v-divider class="ma-4" />
    <v-row justify="center">
      <v-col cols="auto">
        <cc-btn x-large color="primary" @click="$emit('end')">Enter Combat</cc-btn>
      </v-col>
    </v-row>
  </v-window-item>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  DtAction,
  PowerAtCost,
  BuyTime,
  DamnDrink,
  GatherInformation,
  GetConnected,
  ScroungeBarter,
  GetFocused,
  GetCreative,
  GetOrganized,
} from './'

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
    GetFocused,
    GetCreative,
    GetOrganized,
  },
  props: {
    pilot: { type: Object, required: true },
  },
})
</script>
