<template>
  <div>
    <v-row dense align="center" justify="space-around" class="mt-n3">
      <v-col>
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
            Structure: {{ mech.CurrentStructure }}/{{ mech.MaxStructure }}
          </span>
        </cc-tick-bar>
      </v-col>
      <v-col v-if="mech.Armor" class="mx-1">
        <cc-tick-bar
          :key="mech.Armor"
          :current="mech.Armor"
          :max="mech.Armor"
          large
          color="armor"
          full-icon="mdi-shield"
          readonly
        >
          <span class="heading h3">Armor: {{ mech.Armor }}</span>
        </cc-tick-bar>
      </v-col>
      <v-col class="ml-1">
        <cc-tick-bar
          :key="mech.CurrentHP"
          :current="mech.CurrentHP"
          :max="mech.MaxHP"
          large
          color="hp"
          :full-icon="hpResistance ? 'mdi-octagram' : 'mdi-hexagon'"
          @update="mech.CurrentHP = $event"
        >
          <span class="heading h3">HP: {{ mech.CurrentHP }}/{{ mech.MaxHP }}</span>
        </cc-tick-bar>
      </v-col>
    </v-row>

    <v-row dense align="center" justify="space-around">
      <v-col>
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
          <span class="heading h3">Reactor: {{ mech.CurrentStress }}/{{ mech.MaxStress }}</span>
        </cc-tick-bar>
      </v-col>
      <v-col class="mr-4">
        <cc-tick-bar
          :key="mech.CurrentHeat"
          :current="mech.CurrentHeat"
          :max="mech.HeatCapacity"
          large
          :color="mech.IsInDangerZone ? 'dangerzone' : 'heatcap'"
          :full-icon="mech.IsInDangerZone ? 'mdi-fire' : 'mdi-circle'"
          clearable
          @update="mech.CurrentHeat = $event"
        >
          <span v-if="mech.IsInDangerZone" class="dangerzone--text heading h3">
            HEAT: {{ mech.CurrentHeat }}/{{ mech.HeatCapacity }}
          </span>
          <span v-else class="heading h3">
            HEAT: {{ mech.CurrentHeat }}/{{ mech.HeatCapacity }}
          </span>
        </cc-tick-bar>
        <div v-if="mech.IsInDangerZone" class="caption font-weight-bold dangerzone--text">
          // HEAT::DANGER ZONE //
        </div>
        <div v-else class="caption subtle--text">
          HEAT LEVELS NOMINAL
        </div>
      </v-col>
      <v-col>
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
            REPAIR CAPACITY: {{ mech.CurrentRepairs }}/{{ mech.RepairCapacity }}
          </span>
        </cc-tick-bar>
      </v-col>
    </v-row>

    <v-row dense align="center" justify="space-around">
      <v-col class="ml-auto">
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

      <v-col>
        <cc-tick-bar
          :key="mech.CurrentOvercharge"
          :current="mech.CurrentOvercharge"
          :max="3"
          large
          no-input
          clearable
          color="overcharge"
          full-icon="mdi-alert-decagram"
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

      <v-col class="ml-auto">
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
  data: () => ({
    overcharge: [' +1 ', ' +1d3 ', ' +1d6 ', '+1d6+4'],
  }),
})
</script>
