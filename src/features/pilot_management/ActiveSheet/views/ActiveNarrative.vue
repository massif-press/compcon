<template>
  <div>
    <pilot-block :pilot="pilot" />

    <span class="overline">
      DOWNTIME ACTIONS
    </span>
    <v-row dense>
      <dt-action ref="atcost" action-id="act_power_at_a_cost">
        <power-at-cost :pilot="pilot" @close="$refs.atcost.dialog = false" />
      </dt-action>
      <dt-action ref="buytime" action-id="act_buy_some_time">
        <buy-time :pilot="pilot" @close="$refs.buytime.dialog = false" />
      </dt-action>
      <dt-action ref="damndrink" action-id="act_get_a_damn_drink">
        <damn-drink :pilot="pilot" @close="$refs.damndrink.dialog = false" />
      </dt-action>
      <dt-action ref="getcreative" action-id="act_get_creative">
        <get-creative :pilot="pilot" @close="$refs.getcreative.dialog = false" />
      </dt-action>
      <dt-action ref="getfocused" action-id="act_get_focused">
        <get-focused :pilot="pilot" @close="$refs.getfocused.dialog = false" />
      </dt-action>
      <dt-action ref="getorganized" action-id="act_get_organized">
        <get-organized :pilot="pilot" @close="$refs.getorganized.dialog = false" />
      </dt-action>
      <dt-action ref="gatherinfo" action-id="act_gather_information">
        <gather-information :pilot="pilot" @close="$refs.gatherinfo.dialog = false" />
      </dt-action>
      <dt-action ref="getconnected" action-id="act_get_connected">
        <get-connected :pilot="pilot" @close="$refs.getconnected.dialog = false" />
      </dt-action>
      <dt-action ref="scrounge" action-id="act_scrounge_and_barter">
        <scrounge-barter :pilot="pilot" @close="$refs.scrounge.dialog = false" />
      </dt-action>
    </v-row>
  </div>
</template>

<script lang="ts">
import activePilot from '@/features/pilot_management/mixins/activePilot'
import vueMixins from '@/util/vueMixins'
import PilotBlock from '../layout/PilotBlock.vue'
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
} from '../components/Downtime'

export default vueMixins(activePilot).extend({
  name: 'active-narrative',
  components: {
    PilotBlock,
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
})
</script>
