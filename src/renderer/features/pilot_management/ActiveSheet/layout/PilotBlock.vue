<template>
  <div>
    <v-row align="start" class="mb-n3">
      <v-col>
        <span class="heading mech" style="line-height: 5px">{{ pilot.Callsign }}</span>
        <div class="flavor-text grey--text">{{ pilot.Name }}</div>
      </v-col>
      <v-col cols="auto" class="ml-auto text-right mr-2 mt-n2">
        <span class="heading h3 primary--text">HP</span>
        <b>
          <cc-tick-bar
            small
            no-pips
            flip-input
            :current="pilot.CurrentHP"
            :max="pilot.MaxHP"
            @update="pilot.CurrentHP = $event"
          >
            {{ pilot.CurrentHP }}/{{ pilot.MaxHP }}
          </cc-tick-bar>
        </b>
      </v-col>
      <v-col cols="auto" class="text-right mx-2 mt-n2">
        <div class="heading h3 primary--text">Armor</div>
        <div class="font-weight-bold">{{ pilot.Armor }}</div>
      </v-col>
      <v-col cols="auto" class="text-right mx-2 mt-n2">
        <div class="heading h3 primary--text">E-Defense</div>
        <div class="font-weight-bold">{{ pilot.EDefense }}</div>
      </v-col>
      <v-col cols="auto" class="text-right mx-2 mt-n2">
        <div class="heading h3 primary--text">Evasion</div>
        <div class="font-weight-bold">{{ pilot.Evasion }}</div>
      </v-col>
    </v-row>
    <span class="overline">PILOT LOADOUT</span>
    <cc-pilot-loadout :pilot="pilot" readonly />

    <span class="overline">SKILL TRIGGERS</span>
    <v-row dense justify="center">
      <cc-active-card
        v-for="s in pilot.Skills"
        :key="`sk_${s.Skill.ID}`"
        cols="3"
        color="secondary"
        :header="s.Skill.Name"
        subheader="SKILL TRIGGER"
        :content="`+${s.Bonus}`"
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

    <span class="overline">TALENTS</span>
    <v-row>
      <cc-active-card
        v-for="(t, i) in pilot.Talents"
        :key="`tal_${i}`"
        color="primary"
        :cols="t.Rank < 3 ? t.Rank * 3 : 12"
        :header="`${t.Talent.Name} ${'I'.repeat(t.Rank)}`"
        subheader="PILOT TALENT"
      >
        <ul v-for="n in 3" :key="'t_' + n">
          <li v-if="t.Rank >= n">
            <span v-html="t.Talent.Ranks[n - 1].description" />
          </li>
        </ul>
      </cc-active-card>
    </v-row>

    <span v-if="pilot.CoreBonuses" class="overline">CORE BONUSES</span>
    <v-row v-if="pilot.CoreBonuses">
      <cc-active-card
        v-for="(bonus, i) in pilot.CoreBonuses"
        :key="`cb_${i}`"
        :cols="12 / pilot.CoreBonuses.length"
        color="corepower"
        :header="bonus.Name"
        subheader="CORE BONUS"
      >
        <p class="pa-1 ma-0" v-html="bonus.Effect" />
      </cc-active-card>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'pilot-block',
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
})
</script>
