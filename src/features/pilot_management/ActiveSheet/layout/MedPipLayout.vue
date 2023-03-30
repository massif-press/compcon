<template>
  <div>
    <v-row
      density="compact"
      align="center"
      justify="space-between"
      class="mt-n3"
    >
      <v-col cols="auto">
        <cc-tick-bar
          :current="mech.CurrentStructure"
          :max="mech.MaxStructure"
          large
          color="structure"
          full-icon="cc:structure"
          :class="{ rolledOver: structRollover }"
          @update="mech.CurrentStructure = $event"
        >
          <span class="heading h3">Structure</span>
        </cc-tick-bar>
      </v-col>
      <v-col v-if="mech.Armor" cols="auto">
        <cc-tick-bar
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

    <v-row density="compact" align="center" justify="space-between">
      <v-col cols="auto">
        <cc-tick-bar
          :current="mech.CurrentStress"
          :max="mech.MaxStress"
          large
          color="stress"
          full-icon="cc:reactor"
          :class="{ rolledOver: stressRollover }"
          @update="mech.CurrentStress = $event"
        >
          <span class="heading h3">Stress</span>
        </cc-tick-bar>
      </v-col>
      <v-col cols="auto">
        <cc-tick-bar
          :current="mech.CurrentHeat"
          :max="mech.HeatCapacity"
          large
          :color="mech.IsInDangerZone ? 'dangerzone' : 'heatcap'"
          :full-icon="mech.IsInDangerZone ? 'mdi-fire' : 'mdi-circle'"
          clearable
          max-length="12"
          @update="mech.CurrentHeat = $event"
        >
          <span v-if="mech.IsInDangerZone" class="text-dangerzone heading h3"
            >HEAT</span
          >
          <span v-else class="heading h3">HEAT</span>
        </cc-tick-bar>
        <div
          v-if="mech.IsInDangerZone"
          class="caption font-weight-bold text-dangerzone"
        >
          // HEAT::DANGER ZONE //
        </div>
        <div v-else class="caption text-subtle">HEAT LEVELS NOMINAL</div>
      </v-col>
      <v-col cols="auto">
        <cc-tick-bar
          :current="mech.CurrentRepairs"
          :max="mech.RepairCapacity"
          large
          color="repcap"
          full-icon="control_point"
          @update="mech.CurrentRepairs = $event"
        >
          <span class="heading h3">REPAIR CAPACITY</span>
        </cc-tick-bar>
      </v-col>
    </v-row>

    <v-row density="compact" align="center" justify="space-around">
      <v-col cols="auto">
        <cc-tick-bar
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
        <div
          v-if="mech.CurrentCoreEnergy > 0"
          class="caption font-weight-bold text-corepower"
        >
          AVAILABLE
        </div>
        <div v-else class="caption text-subtle">EXHAUSTED</div>
      </v-col>

      <v-col cols="auto">
        <cc-tick-bar
          :current="mech.CurrentOvercharge"
          :max="mech.OverchargeTrack.length - 1"
          large
          no-input
          clearable
          color="overcharge"
          full-icon="mdi-alert-decagram"
          hide-values
          @update="mech.CurrentOvercharge = $event"
        >
          <span class="heading h3">Overcharge</span>
        </cc-tick-bar>
        <div class="caption text-overcharge font-weight-bold">
          +{{ mech.OverchargeTrack[mech.CurrentOvercharge] }}
        </div>
      </v-col>
    </v-row>
    <v-divider class="mt-1 mb-2" />
  </div>
</template>

<script lang="ts">
export default {
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
};
</script>
