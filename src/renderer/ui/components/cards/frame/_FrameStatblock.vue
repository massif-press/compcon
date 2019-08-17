<template>
  <v-container grid-list-md class="mt-0 pt-1">
    <v-layout justify-space-between wrap fill-height>
      <statblock-panel name="Armor" :value="frame.Armor" />
      <statblock-panel name="HP" :value="frame.HP" />
      <statblock-panel name="Evasion" :value="frame.Evasion" />
      <statblock-panel name="E-Defense" :value="frame.EDefense" />
      <statblock-panel name="Heat Capacity" :value="frame.HeatCap" />
      <statblock-panel name="Sensor Range" :value="frame.SensorRange" />
      <statblock-panel name="Tech Attack" :value="frame.TechAttack" />
      <statblock-panel name="Save" :value="frame.Save" />
      <statblock-panel name="Speed" :value="frame.Speed" />
      <statblock-panel name="SP" :value="frame.SP" />
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import StatblockPanel from './_StatblockPanel.vue'

export default Vue.extend({
  name: 'cc-frame-statblock',
  components: { StatblockPanel },
  props: {
    frame: {
      type: Object,
      required: true,
    },
  },
})
</script>