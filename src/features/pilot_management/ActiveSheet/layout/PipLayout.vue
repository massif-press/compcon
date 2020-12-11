<template>
  <div>
    <v-row align="start" dense class="mt-n1 ml-4 mr-2">
      <v-col cols="auto">
        <cc-tick-bar
          :key="mech.CurrentMove"
          :current="mech.CurrentMove"
          :max="mech.MaxMove"
          large
          color="action--move"
          full-icon="mdi-arrow-right-bold-hexagon-outline"
          :number-only="$vuetify.breakpoint.mdAndDown"
          @update="state.SetMove($event)"
        >
          <span class="heading h3">
            Movement
          </span>
        </cc-tick-bar>
      </v-col>
      <v-col cols="auto" align-self="end">
        <cc-synergy-display large location="move" :mech="mech" class="d-inline" />
      </v-col>
      <v-col cols="auto" align-self="center" class="ml-auto text-center">
        <fieldset class="ma-0 py-0 px-3" style="height: 100%;">
          <legend class="overline px-1 mb-n1" style="line-height: 0">
            Active Effects
          </legend>
          <cc-synergy-display large location="active_effects" :mech="mech" />
        </fieldset>
      </v-col>
      <v-col cols="auto" align-self="center">
        <slot name="repair" />
      </v-col>
    </v-row>
    <v-row align="start" class="mt-n3 mx-2">
      <v-col cols="auto" align-self="end" class="ma-0 pa-0">
        <cc-synergy-display large location="structure" :mech="mech" class="d-inline" />
      </v-col>
      <v-col cols="auto">
        <cc-tick-bar
          :key="mech.CurrentStructure"
          :current="mech.CurrentStructure"
          :max="mech.MaxStructure"
          large
          color="structure"
          full-icon="cci-structure"
          :class="{ rolledOver: structRollover }"
          @update="state.SetStructure($event)"
        >
          <span class="heading h3">
            Structure
          </span>
        </cc-tick-bar>
      </v-col>
      <v-col v-if="mech.Armor" cols="auto">
        <v-col cols="auto" align-self="end" class="ma-0 pa-0">
          <cc-synergy-display large location="armor" :mech="mech" class="d-inline" />
        </v-col>
        <cc-tick-bar
          :key="mech.Armor"
          :current="mech.Armor"
          :max="mech.Armor"
          large
          color="armor"
          full-icon="mdi-shield"
          number-only
          readonly
        >
          <span class="heading h3">Armor: {{ mech.Armor }}</span>
        </cc-tick-bar>
      </v-col>
      <v-col cols="auto" align-self="end" class="ma-0 pa-0">
        <cc-synergy-display large location="hp" :mech="mech" class="d-inline" />
      </v-col>
      <v-col cols="auto">
        <cc-tick-bar
          :key="mech.CurrentHP"
          :current="mech.CurrentHP"
          :max="mech.MaxHP"
          large
          color="hp"
          :full-icon="hpResistance ? 'mdi-octagram' : 'mdi-hexagon'"
          :max-length="$vuetify.breakpoint.xl ? 35 : 25"
          :number-only="$vuetify.breakpoint.mdAndDown"
          @update="state.SetHp($event)"
        >
          <span class="heading h3">HP</span>
        </cc-tick-bar>
      </v-col>
      <v-col cols="auto">
        <v-col cols="auto" align-self="end" class="ma-0 pa-0">
          <cc-synergy-display large location="overshield" :mech="mech" class="d-inline" />
        </v-col>
        <cc-tick-bar
          :key="mech.Overshield"
          :current="mech.Overshield"
          :max="mech.Overshield"
          large
          color="stark"
          :full-icon="'mdi-octagram'"
          max-length="6"
          hide-max
          @update="state.SetOvershield($event)"
        >
          <span class="heading h3">OVERSHIELD: {{ mech.Overshield }}</span>
        </cc-tick-bar>
      </v-col>
    </v-row>

    <v-row align="start" class="mt-n3 mx-2">
      <v-col cols="auto" align-self="end" class="ma-0 pa-0">
        <cc-synergy-display large location="stress" :mech="mech" class="d-inline" />
      </v-col>
      <v-col cols="auto">
        <cc-tick-bar
          :key="mech.CurrentStress"
          :current="mech.CurrentStress"
          :max="mech.MaxStress"
          large
          color="stress"
          full-icon="cci-reactor"
          :class="{ rolledOver: stressRollover }"
          @update="state.SetStress($event)"
        >
          <span class="heading h3">Stress</span>
        </cc-tick-bar>
      </v-col>
      <v-col cols="auto">
        <v-col cols="auto" align-self="end" class="ma-0 pa-0">
          <cc-synergy-display large location="heat" :mech="mech" class="d-inline" />
        </v-col>
        <cc-tick-bar
          :key="mech.CurrentHeat"
          :current="mech.CurrentHeat"
          :max="mech.HeatCapacity"
          large
          :color="mech.IsInDangerZone ? 'dangerzone' : 'heatcap'"
          :full-icon="mech.IsInDangerZone ? 'mdi-fire' : 'mdi-circle'"
          :number-only="$vuetify.breakpoint.mdAndDown"
          clearable
          @update="state.SetHeat($event)"
        >
          <span v-if="mech.IsInDangerZone" class="dangerzone--text heading h3">
            HEAT
          </span>
          <span v-else class="heading h3">
            HEAT
          </span>
        </cc-tick-bar>
        <div
          v-if="mech.IsInDangerZone"
          class="caption font-weight-bold dangerzone--text text-center"
        >
          // HEAT::DANGER ZONE //
        </div>
        <div v-else class="caption subtle--text text-center">
          HEAT LEVELS NOMINAL
        </div>
      </v-col>
      <v-col cols="auto">
        <v-col cols="auto" align-self="end" class="ma-0 pa-0">
          <cc-synergy-display large location="repairs" :mech="mech" class="d-inline" />
        </v-col>
        <cc-tick-bar
          :key="mech.CurrentRepairs"
          :current="mech.CurrentRepairs"
          :max="mech.RepairCapacity"
          large
          color="repcap"
          :number-only="$vuetify.breakpoint.mdAndDown"
          full-icon="cci-repair"
          @update="state.SetRepCap($event)"
        >
          <span class="heading h3">
            REPAIR CAPACITY
          </span>
        </cc-tick-bar>
      </v-col>
      <v-col cols="auto">
        <v-col cols="auto" align-self="end" class="ma-0 pa-0">
          <cc-synergy-display large location="overcharge" :mech="mech" class="d-inline" />
        </v-col>
        <cc-tick-bar
          :key="mech.CurrentOvercharge"
          :current="mech.CurrentOvercharge"
          :max="3"
          large
          no-input
          clearable
          color="overcharge"
          full-icon="mdi-alert-decagram"
          class="text-center"
          hide-values
          @update="state.SetOvercharge($event)"
        >
          <span class="heading h3">
            Overcharge
          </span>
        </cc-tick-bar>
        <div class="text-center caption overcharge--text font-weight-bold">
          +{{ mech.OverchargeTrack[mech.CurrentOvercharge] }}
        </div>
      </v-col>
      <v-col cols="auto">
        <v-col cols="auto" align-self="end" class="ma-0 pa-0">
          <cc-synergy-display large location="core_energy" :mech="mech" class="d-inline" />
        </v-col>
        <cc-tick-bar
          :key="mech.CurrentCoreEnergy"
          :current="mech.CurrentCoreEnergy"
          :max="1"
          large
          no-input
          clearable
          color="corepower"
          class="text-center"
          empty-icon="mdi-battery-10"
          full-icon="mdi-battery"
          hide-values
          @update="state.SetCorePower($event)"
        >
          <span class="heading h3">CORE POWER</span>
        </cc-tick-bar>
        <div
          v-if="mech.CurrentCoreEnergy"
          class="text-center caption font-weight-bold corepower--text"
        >
          AVAILABLE
        </div>
        <div v-else class="text-center caption subtle--text">
          EXHAUSTED
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'pip-layout',
  props: {
    mech: {
      type: Object,
      required: true,
    },
    structRollover: { type: Boolean },
    stressRollover: { type: Boolean },
    hpResistance: { type: Boolean },
  },
  computed: {
    state() {
      return this.mech.Pilot.State
    },
  },
})
</script>
