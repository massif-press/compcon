<template>
  <v-container class="mt-0 pt-1" fill-height>
    <v-row justify-space-between wrap dense>
      <cc-statblock-panel name="Armor" :value="frame.Armor" />
      <cc-statblock-panel name="HP" :value="frame.HP" />
      <cc-statblock-panel name="Evasion" :value="frame.Evasion" />
      <cc-statblock-panel name="E-Defense" :value="frame.EDefense" />
      <cc-statblock-panel name="Heat Capacity" :value="frame.HeatCap" />
      <cc-statblock-panel name="Repair Cap" :value="frame.RepCap" />
      <cc-statblock-panel name="Sensor Range" :value="frame.SensorRange" />
      <cc-statblock-panel name="Tech Attack" :value="frame.TechAttack" />
      <cc-statblock-panel name="Repair Capacity" :value="frame.RepCap" />
      <cc-statblock-panel name="Save" :value="frame.SaveTarget" />
      <cc-statblock-panel name="Speed" :value="frame.Speed" />
      <cc-statblock-panel name="SP" :value="frame.SP" />
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'cc-frame-statblock',
  props: {
    frame: {
      type: Object,
      required: true,
    },
  },
})
</script>
