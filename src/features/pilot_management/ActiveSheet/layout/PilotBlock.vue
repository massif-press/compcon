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

    <div v-if="pilot.State.Stage === 'Narrative'">
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
    </div>

    <span v-if="pilot.Reserves || pilot.Organizations" class="overline">
      RESERVES AND RESOURCES
      <v-btn small right icon class="fadeSelect" @click="showReserves = !showReserves">
        <v-icon small v-html="showReserves ? 'mdi-eye-outline' : 'mdi-eye-off-outline'" />
      </v-btn>
    </span>
    <v-scroll-y-reverse-transition mode="out-in">
      <v-row v-if="showReserves && (pilot.Reserves || pilot.Organizations)">
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
    </v-scroll-y-reverse-transition>
  </div>
</template>

<script lang="ts">
import activePilot from '@/features/pilot_management/mixins/activePilot'
import vueMixins from '@/util/vueMixins'

export default vueMixins(activePilot).extend({
  name: 'pilot-block',
  data: () => ({
    showReserves: false,
  }),
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
