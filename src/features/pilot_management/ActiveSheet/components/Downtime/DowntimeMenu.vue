<template>
  <v-container>
    <div class="mt-2 body-text">
      <p>
        Downtime actions represent specific activities undertaken by pilots between missions. Unless
        the downtime takes place over an especially long period, players usually only get to make
        one downtime action per downtime.
      </p>
      <p>
        Unlike skill checks, downtime actions have specific outcomes depending on whether you
        succeed, fail, or roll 20+, and most ask you to choose from a list of possible outcomes.
        Even though downtime actions aren’t skill checks, triggers can still be used to get bonuses
        when rolling. For example, the GET A DAMN DRINK action might benefit from Survive (alcohol
        tolerance), Charm (impressing the locals), or Word on the Streets (eavesdropping for
        gossip).
      </p>
      <p>
        Although the outcomes of downtime actions depend on the roll, it’s up to the GM and player
        to flesh out the details using the provided prompts. You can go into as much detail as you
        want about what actually takes place.
      </p>
      <p>
        In addition to the downtime actions provided here, you can also easily create new ones that
        are more relevant to your particular game or story. Use these as starting points!
      </p>
    </div>
    <v-expansion-panels accordion>
      <dt-menu-expander ref="atcost" action-id="act_power_at_a_cost">
        <power-at-cost :pilot="pilot" @close="$emit('close')" />
      </dt-menu-expander>
      <dt-menu-expander ref="buytime" action-id="act_buy_some_time">
        <buy-time :pilot="pilot" @close="$emit('close')" />
      </dt-menu-expander>
      <dt-menu-expander ref="damndrink" action-id="act_get_a_damn_drink">
        <damn-drink :pilot="pilot" @close="$emit('close')" />
      </dt-menu-expander>
      <dt-menu-expander ref="getcreative" action-id="act_get_creative">
        <get-creative :pilot="pilot" @close="$emit('close')" />
      </dt-menu-expander>
      <dt-menu-expander ref="getfocused" action-id="act_get_focused">
        <get-focused :pilot="pilot" @close="$emit('close')" />
      </dt-menu-expander>
      <dt-menu-expander ref="getorganized" action-id="act_get_organized">
        <get-organized :pilot="pilot" @close="$emit('close')" />
      </dt-menu-expander>
      <dt-menu-expander ref="gatherinfo" action-id="act_gather_information">
        <gather-information :pilot="pilot" @close="$emit('close')" />
      </dt-menu-expander>
      <dt-menu-expander ref="getconnected" action-id="act_get_connected">
        <get-connected :pilot="pilot" @close="$emit('close')" />
      </dt-menu-expander>
      <dt-menu-expander ref="scrounge" action-id="act_scrounge_and_barter">
        <scrounge-barter :pilot="pilot" @close="$emit('close')" />
      </dt-menu-expander>
    </v-expansion-panels>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import activePilot from '../../../mixins/activePilot'

import {
  DtMenuExpander,
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
  name: 'downtime-menu',
  components: {
    DtMenuExpander,
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
  mixins: [activePilot],
})
</script>
