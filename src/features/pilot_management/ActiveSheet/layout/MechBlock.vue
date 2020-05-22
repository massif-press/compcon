<template>
  <div>
    <cc-stress-table ref="stressTable" :mech="mech" />
    <cc-structure-table ref="structureTable" :mech="mech" />

    <div v-if="!mech" class="ma-5">
      <div v-if="!pilot.Mechs.length">
        <v-alert type="error" prominent>
          <span class="heading h3">No Saved Mech Configurations</span>
          <br />
        </v-alert>
      </div>
      <div v-else class="ma-5">
        <v-alert value="visible" type="warning" class="mb-3 effect-text">
          <span class="heading h3">No Active Mech Detected</span>
        </v-alert>
        <mech-select-button big :mechs="pilot.Mechs" @select="pilot.ActiveMech = $event" />
      </div>
    </div>
    <div v-else-if="mech && !pilot.Mounted">
      <v-divider class="my-2" />
      <v-alert prominent dense outlined border="bottom" color="accent" icon="cci-frame">
        <div class="overline text--text">PILOT DISMOUNTED - MECH STATUS: [ IDLE ]</div>
        <div class="heading h3 mt-n2">
          <div class="stark--text">
            {{ mech.Frame.Source }} {{ mech.Frame.Name }}
            <cc-slashes />
            {{ mech.Name }}
            <span class="ml-1 flavor-text subtle--text">(ACTIVE MECH)</span>
          </div>
        </div>
        <cc-tooltip simple content="Enter the mech and switch to Mech Mode">
          <v-btn color="secondary" outlined block class="my-1" @click="pilot.Mounted = true">
            mount mech
          </v-btn>
        </cc-tooltip>
      </v-alert>
    </div>
    <div v-else>
      <v-row dense>
        <v-col class="mt-n5">
          <div class="overline subtle--text">MOUNTED::</div>
          <div class="heading h2 mt-n3">
            <span class="accent--text">{{ mech.Frame.Source }} {{ mech.Frame.Name }}</span>
            <cc-slashes />
            <span class="stark--text">{{ mech.Name }}</span>
          </div>
          <div class="overline subtle--text">PILOT::</div>
          <div class="heading h2 mt-n3 subtle--text">{{ pilot.Callsign }}</div>
        </v-col>
        <v-col cols="auto" class="ml-auto mr-2">
          <mech-select-button :mechs="pilot.Mechs" @select="pilot.ActiveMech = $event" />
        </v-col>
        <v-col v-if="pilot.Mounted" cols="auto">
          <cc-tooltip title="DISMOUNT MECH" content="Exit the mech and switch to Pilot Mode">
            <v-btn small outlined @click="pilot.Mounted = false">dismount mech</v-btn>
          </cc-tooltip>
        </v-col>
      </v-row>

      <cc-mech-status-alert
        v-for="s in mech.StatusString"
        :key="`status-${s}`"
        :type="s"
        critical-only
        @clear-ejected="mech.Ejected = false"
        @clear-status="mech.Repair()"
      />

      <v-row justify="space-between" dense>
        <v-col cols="3">
          <cc-status-select
            label="Statuses"
            :items="statuses"
            :model="mech.Statuses"
            dark
            color="deep-orange darken-1"
            @set="mech.Statuses = $event"
          />
        </v-col>
        <v-col cols="3">
          <cc-status-select
            label="Conditions"
            :items="conditions"
            :model="mech.Conditions"
            dark
            color="red darken-2"
            @set="mech.Conditions = $event"
          />
        </v-col>
        <v-col cols="3">
          <cc-status-select
            label="Resistances"
            :items="resistances"
            :model="mech.Resistances"
            dark
            color="blue darken-2"
            @set="mech.Resistances = $event"
          />
        </v-col>

        <v-col cols="auto" class="ml-auto mr-3">
          <v-text-field
            v-model="mech.Burn"
            type="number"
            append-outer-icon="mdi-plus-circle-outline"
            append-icon="mdi-fire"
            prepend-icon="mdi-minus-circle-outline"
            style="width: 115px"
            class="hide-input-spinners"
            hint="BURN"
            persistent-hint
            dense
            @click:append-outer="mech.Burn += 1"
            @click:prepend="mech.Burn -= 1"
            @change="mech.Burn = parseInt($event)"
          />
        </v-col>
      </v-row>

      <large-pip-layout
        v-if="$vuetify.breakpoint.lgAndUp"
        :mech="mech"
        :struct-rollover="structRolledOver"
        :stress-rollover="stressRolledOver"
        :hp-resistance="hpResistance"
      />
      <med-pip-layout
        v-else-if="$vuetify.breakpoint.mdAndUp"
        :mech="mech"
        :struct-rollover="structRolledOver"
        :stress-rollover="stressRolledOver"
        :hp-resistance="hpResistance"
      />
      <small-pip-layout
        v-else
        :mech="mech"
        :struct-rollover="structRolledOver"
        :stress-rollover="stressRolledOver"
        :hp-resistance="hpResistance"
      />

      <v-row dense align="center">
        <v-col cols="auto" class="flavor-text mr-2 ml-2 mt-n2">
          <span class="heading h2 accent--text">{{ pilot.MechSkills.Hull }}</span>
          <span>//HULL</span>
          <br />
          <span class="heading h2 accent--text">{{ pilot.MechSkills.Agi }}</span>
          <span>//AGI</span>
          <br />
          <span class="heading h2 accent--text">{{ pilot.MechSkills.Sys }}</span>
          <span>//SYS</span>
          <br />
          <span class="heading h2 accent--text">{{ pilot.MechSkills.Eng }}</span>
          <span>//ENG</span>
          <br />
        </v-col>
        <v-col>
          <v-row>
            <cc-active-card prominent color="frame" header="Speed" :content="mech.Speed" />
            <cc-active-card
              prominent
              color="frame"
              :header="$vuetify.breakpoint.lgAndUp ? 'Attack Bonus' : 'Atk Bonus'"
              :content="`${mech.AttackBonus > 0 ? '+' : ''}${mech.AttackBonus}`"
            />
            <cc-active-card
              prominent
              color="frame"
              :header="$vuetify.breakpoint.lgAndUp ? 'Tech Attack' : 'Tech Atk'"
              :content="`${mech.TechAttack > 0 ? '+' : ''}${mech.TechAttack}`"
            />
          </v-row>
          <v-row>
            <cc-active-card
              prominent
              color="frame"
              header="Evasion"
              :content="mech.IsStunned ? 5 : mech.Evasion"
            />
            <cc-active-card
              prominent
              color="frame"
              :header="$vuetify.breakpoint.lgAndUp ? 'E-Defense' : 'E-Def'"
              :content="mech.EDefense"
            />
            <cc-active-card
              prominent
              color="frame"
              :header="$vuetify.breakpoint.lgAndUp ? 'Save Target' : 'Save'"
              :content="mech.SaveTarget"
            />
            <cc-active-card
              prominent
              color="frame"
              :header="$vuetify.breakpoint.lgAndUp ? 'Sensor Range' : 'Sensors'"
              :content="mech.SensorRange"
            />
          </v-row>
        </v-col>
        <v-col cols="auto">
          <v-icon size="120" color="frame">{{ mech.SizeIcon }}</v-icon>
        </v-col>
      </v-row>

      <v-row dense>
        <v-col cols="4">
          <cc-active-card
            v-for="(trait, i) in mech.Frame.Traits"
            :key="`tr_${i}`"
            color="frame"
            :header="trait.name"
            subheader="FRAME TRAIT"
          >
            <span v-html="trait.description" />
          </cc-active-card>
        </v-col>
        <v-col cols="8">
          <cc-active-card
            color="corepower"
            :header="mech.Frame.CoreSystem.Name"
            subheader="CORE SYSTEM"
            style="height: 100%"
          >
            <div v-if="mech.Frame.CoreSystem.PassiveName">
              <span class="heading h2">
                {{ mech.Frame.CoreSystem.PassiveName }}
                <span class="pt-2 ml-2 caption subtle--text">(PASSIVE)</span>
              </span>
              <p class="mb-1" v-html="mech.Frame.CoreSystem.PassiveEffect" />
              <br />
              <br />
            </div>
            <span class="heading h2">
              {{ mech.Frame.CoreSystem.ActiveName }}
              <span class="pt-2 ml-2 caption subtle--text">(ACTIVE)</span>
            </span>
            <p class="mb-1 text--text body-text" v-html="mech.Frame.CoreSystem.ActiveEffect" />
            <cc-tags :tags="mech.Frame.CoreSystem.Tags" color="corepower" />
          </cc-active-card>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="auto">
          <span class="overline">CORE BONUSES</span>
        </v-col>
        <v-col cols="auto" class="ml-auto">
          <v-btn
            x-small
            outlined
            class="fadeSelect"
            @click="expandAll(pilot.CoreBonuses.length, 'cb_', true)"
          >
            <v-icon small left>mdi-chevron-up</v-icon>
            All
          </v-btn>
          <v-btn
            x-small
            outlined
            class="fadeSelect"
            @click="expandAll(pilot.CoreBonuses.length, 'cb_', false)"
          >
            <v-icon small left>mdi-chevron-down</v-icon>
            All
          </v-btn>
        </v-col>
      </v-row>
      <v-row v-if="pilot.CoreBonuses">
        <cc-active-card
          v-for="(bonus, i) in pilot.CoreBonuses"
          :key="`cb_${i}`"
          :ref="`cb_${i}`"
          :cols="12 / pilot.CoreBonuses.length"
          color="corepower"
          collapsible
          :header="bonus.Name"
          subheader="CORE BONUS"
        >
          <p class="pa-1 ma-0" v-html="bonus.Effect" />
        </cc-active-card>
      </v-row>
      <v-row dense>
        <v-col cols="auto">
          <span class="overline">TALENTS</span>
        </v-col>
        <v-col cols="auto" class="ml-auto">
          <v-btn
            x-small
            outlined
            class="fadeSelect"
            @click="expandAll(pilot.Talents.length, 'tal_', true)"
          >
            <v-icon small left>mdi-chevron-up</v-icon>
            All
          </v-btn>
          <v-btn
            x-small
            outlined
            class="fadeSelect"
            @click="expandAll(pilot.Talents.length, 'tal_', false)"
          >
            <v-icon small left>mdi-chevron-down</v-icon>
            All
          </v-btn>
        </v-col>
      </v-row>
      <v-row justify="center">
        <cc-active-card
          v-for="(t, i) in pilot.Talents"
          :key="`tal_${i}`"
          :ref="`tal_${i}`"
          collapsible
          start-closed
          color="primary"
          :cols="6"
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
      <cc-counter-set :actor="pilot" />
      <cc-mech-loadout :mech="mech" readonly />
    </div>
  </div>
</template>

<script lang="ts">
import sleep from '@/util/sleep'
import { Mech, MechLoadout } from '@/class'
import MechSelectButton from '../components/MechSelectButton.vue'
import LargePipLayout from './LargePipLayout.vue'
import MedPipLayout from './MedPipLayout.vue'
import SmallPipLayout from './SmallPipLayout.vue'

import Vue from 'vue'
export default Vue.extend({
  name: 'mech-block',
  components: { MechSelectButton, LargePipLayout, MedPipLayout, SmallPipLayout },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    tabs: 0,
    burn: 0,
    resistances: [
      { name: 'Kinetic', color: 'kinetic' },
      { name: 'Energy', color: 'energy' },
      { name: 'Explosive', color: 'explosive' },
      { name: 'Heat', color: 'heat' },
      { name: 'Burn', color: 'burn' },
      { name: 'All', color: 'variable' },
      { name: 'Next Attack', color: 'overcharge' },
    ],
    structRolledOver: false,
    stressRolledOver: false,
  }),
  computed: {
    mech(): Mech {
      return this.pilot.ActiveMech || null
    },
    overcharge(): string[] {
      return this.pilot.has('corebonus', 'cb_heatfall_coolant_system')
        ? [' +1 ', ' +1d3 ', ' +1d6 ', '+1d6']
        : [' +1 ', ' +1d3 ', ' +1d6 ', '+1d6+4']
    },
    loadout(): MechLoadout {
      return this.mech.ActiveLoadout
    },
    statuses(): string[] {
      return this.$store.getters.getItemCollection('Statuses').filter(x => x.type === 'Status')
    },
    conditions(): string[] {
      return this.$store.getters.getItemCollection('Statuses').filter(x => x.type === 'Condition')
    },
    hpResistance(): boolean {
      if (this.mech.Resistances.length === 1 && this.mech.Resistances[0] === 'Heat') return false
      return !!this.mech.Resistances.length
    },
    hpColor(): string {
      if (this.mech.Resistances.length) {
        if (this.mech.Resistances.length === 1) {
          const c = this.resistances
            .find(x => x.name === this.mech.Resistances[0])
            .name.toLowerCase()
          if (c === 'heat') return 'heat'
          return 'overcharge'
        }
        return 'variable--damage'
      }
      return 'hp'
    },
  },
  watch: {
    'mech.CurrentStructure': {
      async handler(newVal: number, oldVal: number) {
        if (newVal < oldVal) {
          this.structRolledOver = true
          await sleep(500)
          this.structRolledOver = false
          this.$refs.structureTable.show()
        }
      },
    },
    'mech.CurrentStress': {
      async handler(newVal: number, oldVal: number) {
        if (newVal < oldVal) {
          this.stressRolledOver = true
          await sleep(500)
          this.stressRolledOver = false
          this.$refs.stressTable.show()
        }
      },
    },
  },
  methods: {
    expandAll(len: number, key: string, expand: boolean) {
      for (let i = 0; i < len; i++) {
        const k = key + i
        if (this.$refs[k]) this.$refs[k][0].collapsed = expand
      }
    },
  },
})
</script>

<style>
.rolledOver * {
  animation-name: rollover;
  animation-duration: 500ms;
  animation-timing-function: ease-out;
}

@keyframes rollover {
  0% {
    color: red;
  }
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
  100% {
    color: inherit;
  }
}
</style>
