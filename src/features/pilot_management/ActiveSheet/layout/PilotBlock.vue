<template>
  <div v-show="!pilot.Mounted">
    <v-row align="start" class="mb-n3">
      <v-col>
        <span class="heading mech" style="line-height: 5px">{{ pilot.Callsign }}</span>
        <div class="flavor-text subtle--text">{{ pilot.Name }}</div>
      </v-col>
      <v-col cols="auto" class="ml-auto text-right mr-2 mt-n2">
        <span class="heading h3 accent--text">HP</span>
        <b>
          <cc-tick-bar
            small
            no-pips
            flip-input
            :current="pilot.CurrentHP"
            :max="pilot.MaxHP"
            @update="pilot.CurrentHP = $event"
          ></cc-tick-bar>
        </b>
      </v-col>
      <v-col cols="auto" class="text-right mx-2 mt-n2">
        <div class="heading h3 accent--text">Armor</div>
        <div class="font-weight-bold">{{ pilot.Armor }}</div>
      </v-col>
      <v-col cols="auto" class="text-right mx-2 mt-n2">
        <div class="heading h3 accent--text">E-Defense</div>
        <div class="font-weight-bold">{{ pilot.EDefense }}</div>
      </v-col>
      <v-col cols="auto" class="text-right mx-2 mt-n2">
        <div class="heading h3 accent--text">Evasion</div>
        <div class="font-weight-bold">{{ pilot.Evasion }}</div>
      </v-col>
      <v-col cols="auto" class="text-right mx-2 mt-n2">
        <div class="heading h3 accent--text">Grit</div>
        <div class="font-weight-bold">+{{ pilot.Grit }}</div>
      </v-col>
    </v-row>
    <span class="overline">PILOT LOADOUT</span>
    <cc-pilot-loadout :pilot="pilot" readonly />

    <v-row dense>
      <v-col cols="auto">
        <span class="overline">SKILL TRIGGERS</span>
      </v-col>
      <v-col cols="auto" class="ml-auto">
        <v-btn
          x-small
          outlined
          class="fadeSelect"
          @click="expandAll(pilot.Skills.length, 'sk_', true)"
        >
          <v-icon small left>mdi-chevron-up</v-icon>
          All
        </v-btn>
        <v-btn
          x-small
          outlined
          class="fadeSelect"
          @click="expandAll(pilot.Skills.length, 'sk_', false)"
        >
          <v-icon small left>mdi-chevron-down</v-icon>
          All
        </v-btn>
      </v-col>
    </v-row>
    <v-row dense justify="center">
      <cc-active-card
        v-for="(s, i) in pilot.Skills"
        :key="`sk_${i}`"
        :ref="`sk_${i}`"
        :cols="$vuetify.breakpoint.lgAndUp ? 4 : 6"
        color="secondary"
        collapsible
        start-closed
        :header="`${s.Skill.Name} (+${s.Bonus})`"
        :content="s.Skill.Detail"
      />
    </v-row>

    <span v-if="pilot.Reserves || pilot.Organizations" class="overline">
      RESERVES AND RESOURCES
    </span>
    <v-row v-if="pilot.Reserves || pilot.Organizations">
      <cc-reserve-item
        v-for="(r, i) in pilot.Reserves"
        :key="`r_${i}`"
        :reserve="r"
        @remove="pilot.RemoveReserve(i)"
      />
      <cc-org-item
        v-for="(o, i) in pilot.Organizations"
        :key="`o_${i}`"
        :org="o"
        @remove="pilot.RemoveOrganization(i)"
      />
    </v-row>

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
} from '../components/Downtime'

export default Vue.extend({
  name: 'pilot-block',
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
    pilot: {
      type: Object,
      required: true,
    },
  },
  methods: {
    expandAll(len: number, key: string, expand: boolean) {
      for (let i = 0; i < len; i++) {
        const k = key + i
        this.$refs[k][0].collapsed = expand
      }
    },
  },
})
</script>
