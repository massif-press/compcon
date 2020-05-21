<template>
  <div>
    <v-row dense align="center" justify="space-between" class="mt-n3">
      <v-col cols="auto">
        <cc-tick-bar
          :key="mech.CurrentStructure"
          :current="mech.CurrentStructure"
          :max="mech.MaxStructure"
          large
          color="structure"
          full-icon="cci-structure"
          :class="{ rolledOver: structRollover }"
          @update="mech.CurrentStructure = $event"
        >
          <span class="heading h3">
            Structure
          </span>
        </cc-tick-bar>
      </v-col>
      <v-col v-if="mech.Armor" cols="auto">
        <cc-tick-bar
          :key="mech.Armor"
          :current="mech.Armor"
          :max="mech.Armor"
          large
          color="armor"
          full-icon="mdi-shield"
          readonly
          number-only
          hide-values
        >
          <span class="heading h3">Armor</span>
        </cc-tick-bar>
      </v-col>
      <v-col cols="auto">
        <cc-tick-bar
          :key="mech.CurrentHP"
          :current="mech.CurrentHP"
          :max="mech.MaxHP"
          large
          color="hp"
          :full-icon="hpResistance ? 'mdi-octagram' : 'mdi-hexagon'"
          max-length="16"
          @update="mech.CurrentHP = $event"
        >
          <span class="heading h3">HP</span>
        </cc-tick-bar>
      </v-col>
      <v-col cols="auto">
        <cc-tick-bar
          :key="mech.Overshield"
          :current="mech.Overshield"
          :max="mech.Overshield"
          large
          color="stark"
          :full-icon="'mdi-octagram'"
          number-only
          hide-values
          @update="mech.Overshield = $event"
        >
          <span class="heading h3">OVERSHIELD</span>
        </cc-tick-bar>
      </v-col>
    </v-row>

    <v-row dense align="center" justify="space-between">
      <v-col cols="auto">
        <cc-tick-bar
          :key="mech.CurrentStress"
          :current="mech.CurrentStress"
          :max="mech.MaxStress"
          large
          color="stress"
          full-icon="cci-reactor"
          :class="{ rolledOver: stressRollover }"
          @update="mech.CurrentStress = $event"
        >
          <span class="heading h3">Reactor</span>
        </cc-tick-bar>
      </v-col>
      <v-col cols="auto">
        <cc-tick-bar
          :key="mech.CurrentHeat"
          :current="mech.CurrentHeat"
          :max="mech.HeatCapacity"
          large
          :color="mech.IsInDangerZone ? 'dangerzone' : 'heatcap'"
          :full-icon="mech.IsInDangerZone ? 'mdi-fire' : 'mdi-circle'"
          clearable
          max-length="12"
          @update="mech.CurrentHeat = $event"
        >
          <span v-if="mech.IsInDangerZone" class="dangerzone--text heading h3">
            HEAT
          </span>
          <span v-else class="heading h3">
            HEAT
          </span>
        </cc-tick-bar>
        <div v-if="mech.IsInDangerZone" class="caption font-weight-bold dangerzone--text">
          // HEAT::DANGER ZONE //
        </div>
        <div v-else class="caption subtle--text">
          HEAT LEVELS NOMINAL
        </div>
      </v-col>
      <v-col cols="auto">
        <cc-tick-bar
          :key="mech.CurrentRepairs"
          :current="mech.CurrentRepairs"
          :max="mech.RepairCapacity"
          large
          color="repcap"
          full-icon="control_point"
          @update="mech.CurrentRepairs = $event"
        >
          <span class="heading h3">
            REPAIR CAPACITY
          </span>
        </cc-tick-bar>
      </v-col>
    </v-row>

    <v-row dense align="center" justify="space-around">
      <v-col cols="auto">
        <cc-tick-bar
          :key="mech.CurrentCoreEnergy"
          :current="mech.CurrentCoreEnergy"
          :max="1"
          large
          no-input
          clearable
          color="corepower"
          empty-icon="mdi-battery-10"
          full-icon="mdi-battery"
          max-length="12"
          hide-values
          @update="mech.CurrentCoreEnergy = $event"
        >
          <span class="heading h3">CORE POWER</span>
        </cc-tick-bar>
        <div v-if="mech.CurrentCoreEnergy" class="caption font-weight-bold corepower--text">
          AVAILABLE
        </div>
        <div v-else class="caption subtle--text">
          EXHAUSTED
        </div>
      </v-col>

      <v-col cols="auto">
        <cc-tick-bar
          :key="mech.CurrentOvercharge"
          :current="mech.CurrentOvercharge"
          :max="3"
          large
          no-input
          clearable
          color="overcharge"
          full-icon="mdi-alert-decagram"
          hide-values
          @update="mech.CurrentOvercharge = $event"
        >
          <span class="heading h3">
            Overcharge
          </span>
        </cc-tick-bar>
        <div class="caption overcharge--text font-weight-bold">
          {{ overcharge[mech.CurrentOvercharge] }}
        </div>
      </v-col>

      <v-col cols="auto" class="text-center">
        <v-menu offset-y offset-x top nudge-left="30px">
          <template v-slot:activator="{ on }">
            <v-btn large outlined class="fadeSelect" v-on="on">
              <v-icon large left>cci-repair</v-icon>
              Full Repair
            </v-btn>
          </template>
          <cc-confirmation
            content="Lancer, this will <span class='accent--text'>fully repair and recharge this mech.</span> Do you want to continue?"
            @confirm="mech.FullRepair()"
          />
        </v-menu>
      </v-col>
    </v-row>
    <v-divider class="mt-1 mb-2" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'med-pip-layout',
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
    overcharge(): string[] {
      return this.mech.Pilot.has('corebonus', 'cb_heatfall_coolant_system')
        ? [' +1 ', ' +1d3 ', ' +1d6 ', '+1d6']
        : [' +1 ', ' +1d3 ', ' +1d6 ', '+1d6+4']
    },
  },
})
</script>
