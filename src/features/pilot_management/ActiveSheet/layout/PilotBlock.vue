<template>
  <div>
    <v-row :justify="$vuetify.breakpoint.mdAndUp ? 'start' : 'center'" align="start" class="mb-n3">
      <v-col>
        <span class="heading mech" style="line-height: 5px">{{ pilot.Callsign }}</span>
        <div class="flavor-text subtle--text">{{ pilot.Name }}</div>
      </v-col>
      <v-col cols="auto" class="ml-auto text-right mr-2 mt-n2">
        <div class="heading h3 accent--text">HP</div>
        <div class="font-weight-bold mr-n5">
          <v-btn icon x-small class="fadeSelect" @click="pilot.CurrentHP -= 1">
            <v-icon small color="primary">mdi-minus</v-icon>
          </v-btn>
          {{ pilot.CurrentHP }}/{{ pilot.MaxHP }}
          <v-btn icon x-small class="fadeSelect" @click="pilot.CurrentHP += 1">
            <v-icon small color="primary">mdi-plus</v-icon>
          </v-btn>
        </div>
      </v-col>
      <v-col cols="auto" class="text-right mx-2 mt-n2">
        <component
          :is="$vuetify.breakpoint.mdAndUp ? 'div' : 'span'"
          class="heading h3 accent--text"
        >
          Armor
        </component>
        <component :is="$vuetify.breakpoint.mdAndUp ? 'div' : 'span'" class="font-weight-bold">
          {{ pilot.Armor }}
        </component>
      </v-col>
      <v-col cols="auto" class="text-right mx-2 mt-n2">
        <component
          :is="$vuetify.breakpoint.mdAndUp ? 'div' : 'span'"
          class="heading h3 accent--text"
        >
          {{ $vuetify.breakpoint.mdAndUp ? 'E-DEFENSE' : 'E-DEF' }}
        </component>
        <component :is="$vuetify.breakpoint.mdAndUp ? 'div' : 'span'" class="font-weight-bold">
          {{ pilot.EDefense }}
        </component>
      </v-col>
      <v-col cols="auto" class="text-right mx-2 mt-n2">
        <component
          :is="$vuetify.breakpoint.mdAndUp ? 'div' : 'span'"
          class="heading h3 accent--text"
        >
          Evasion
        </component>
        <component :is="$vuetify.breakpoint.mdAndUp ? 'div' : 'span'" class="font-weight-bold">
          {{ pilot.Evasion }}
        </component>
      </v-col>
      <v-col cols="auto" class="text-right mx-2 mt-n2">
        <component
          :is="$vuetify.breakpoint.mdAndUp ? 'div' : 'span'"
          class="heading h3 accent--text"
        >
          Grit
        </component>
        <component :is="$vuetify.breakpoint.mdAndUp ? 'div' : 'span'" class="font-weight-bold">
          +{{ pilot.Grit }}
        </component>
      </v-col>
    </v-row>

    <clone-block v-if="pilot.State.Stage === 'Narrative'" hide-quirks />

    <destroyed-alert
      v-if="pilot.ActiveMech && pilot.ActiveMech.Destroyed"
      :mech="pilot.ActiveMech"
      @restore="pilot.ActiveMech.BasicRepair($event)"
    />

    <v-row v-if="pilot.State.SelfDestructCounter > 0" dense justify="center" class="text-center">
      <v-col cols="auto">
        <v-alert dense outlined color="error" prominent>
          <v-icon slot="prepend" color="error" size="90" class="mr-3">
            cci-reactor
          </v-icon>
          <span v-if="pilot.State.SelfDestructCounter > 1" class="heading h1">
            MECH WILL SELF DESTRUCT IN {{ pilot.State.SelfDestructCounter }} ROUNDS
          </span>
          <span v-else class="heading h1">MECH SELF DESTRUCTION IMMINENT</span>
          <div class="heading mt-n4 subtle--text">
            FRAME.PRIORITY.ALERT::REACTOR CRITICALITY EVENT
          </div>
          <div class="px-5 my-1">
            <v-btn small block color="error" @click="pilot.State.SelfDestruct()">
              <v-icon left>mdi-skull</v-icon>
              DETONATE REACTOR
              <v-icon right>mdi-skull</v-icon>
            </v-btn>
          </div>
          <div class="text-right mt-1">
            <v-btn
              x-small
              color="primary"
              class="fadeSelect"
              @click="pilot.State.CancelSelfDestruct()"
            >
              <v-icon small left>mdi-reload</v-icon>
              UNDO
            </v-btn>
          </div>
        </v-alert>
      </v-col>
    </v-row>

    <v-alert
      v-if="pilot.IsDownAndOut"
      prominent
      dense
      color="warning"
      outlined
      icon="mdi-account-alert"
    >
      <div class="heading h2">DOWN AND OUT</div>
      <div class="body-text text--text">
        This Pilot is unconscious and STUNNED – if they take any more damage, they die. They'll
        regain consciousness and half of their HP when they rest.
      </div>
      <div style="position: relative">
        <v-btn
          small
          :absolute="$vuetify.breakpoint.mdAndUp"
          color="error"
          class="fadeSelect"
          style="bottom: 0; right: 0"
          @click="pilot.Kill()"
        >
          <v-icon>mdi-skull</v-icon>
          Mark as Killed
        </v-btn>
      </div>
    </v-alert>

    <div :style="pilot.IsDead || pilot.IsDownAndOut ? 'opacity: 0.5' : ''">
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
            :cols="$vuetify.breakpoint.smAndDown ? 12 : $vuetify.breakpoint.lgAndUp ? 4 : 6"
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
        <v-row v-if="showReserves && (pilot.Reserves || pilot.Organizations)" class="mt-n3">
          <cc-reserve-item
            v-for="(r, i) in pilot.Reserves.filter(r => r.Type !== 'Bonus')"
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
  </div>
</template>

<script lang="ts">
import activePilot from '@/features/pilot_management/mixins/activePilot'
import vueMixins from '@/util/vueMixins'
import CloneBlock from '@/features/pilot_management/PilotSheet/sections/info/components/CloneBlock.vue'
import DestroyedAlert from '../components/DestroyedAlert.vue'

export default vueMixins(activePilot).extend({
  name: 'pilot-block',
  components: { CloneBlock, DestroyedAlert },
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
