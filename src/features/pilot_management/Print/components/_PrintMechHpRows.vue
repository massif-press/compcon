<template>
  <v-row dense
    class="mt-n1">
    <print-hp-block title="HP"
      :value="mech.MaxHP"
      max-label="MAX HP"
      :blank="blank"
      :cols="4" />

    <print-hp-block title="STRUCTURE"
      :value="mech.MaxStructure"
      max-label="MAX STRUCTURE"
      :blank="blank"
      :cols="3"
      v-bind="compact ? { 'show-upper-section': false } : {}" />

    <print-hp-block title="OVERSHIELD"
      :blank="true"
      :show-value="false"
      :show-max-label="false"
      :cols="3" />

    <v-col v-if="mech.Armor"
      class="text-center">
      <fieldset>
        <legend class="font-weight-bold caption text-primary px-2 text-center">ARMOR</legend>

        <blank-line v-if="blank"
          :height="102" />

        <v-row v-else
          style="height: 100%"
          class="mt-0"
          align="center">
          <v-col class="text-primary">
            <v-icon v-for="n in mech.Armor"
              :key="`armor-${n}`"
              size="40"
              style="opacity: 0.6"
              icon="mdi-shield-outline" />
          </v-col>
        </v-row>
      </fieldset>
    </v-col>
  </v-row>

  <v-row dense>
    <print-hp-block title="HEAT"
      :value="mech.HeatCapacity"
      max-label="HEAT CAPACITY"
      :blank="blank"
      :cols="4"
      v-bind="compact ? { 'show-upper-section': false } : {}" />

    <print-hp-block title="STRESS"
      :value="mech.MaxStress"
      max-label="MAX STRESS"
      :blank="blank"
      :cols="3"
      v-bind="compact ? { 'show-upper-section': false } : {}" />

    <print-hp-block title="REPAIRS"
      :value="mech.RepairCapacity"
      max-label="REPAIR CAPACITY"
      :blank="blank"
      :cols="3"
      v-bind="compact ? { 'show-upper-section': false } : {}" />

    <v-col class="text-center">
      <fieldset>
        <legend class="font-weight-bold caption text-primary px-2 text-center">CORE POWER</legend>

        <blank-line v-if="blank"
          :height="102" />

        <v-row v-else
          style="height: 100%"
          class="mt-0"
          align="center">
          <v-col class="text-primary">
            <v-icon size="40"
              style="opacity: 0.6"
              icon="mdi-battery-outline" />
          </v-col>
        </v-row>
      </fieldset>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import BlankLine from './blank/line.vue';
defineProps<{
  mech: any
  blank: boolean
  compact?: boolean
}>()
</script>
