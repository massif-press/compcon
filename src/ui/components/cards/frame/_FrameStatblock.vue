<template>
  <v-container class="mt-0 pt-1">
    <v-row justify="center" dense>
      <cc-statblock-panel icon="cci-structure" name="Structure" :value="frame.Structure" />
      <cc-statblock-panel icon="cci-reactor" name="Stress" :value="frame.HeatStress" />
      <cc-statblock-panel icon="$vuetify.icons.armor" name="Armor" :value="frame.Armor" />
      <cc-statblock-panel icon="$vuetify.icons.hp" name="HP" :value="frame.HP" />
      <cc-statblock-panel icon="$vuetify.icons.evasion" name="Evasion" :value="frame.Evasion" />
      <cc-statblock-panel icon="$vuetify.icons.edef" name="E-Defense" :value="frame.EDefense" />
      <cc-statblock-panel icon="$vuetify.icons.heat" name="Heat Capacity" :value="frame.HeatCap" />
      <cc-statblock-panel
        icon="$vuetify.icons.sensor"
        name="Sensor Range"
        :value="frame.SensorRange"
      />
      <cc-statblock-panel icon="$vuetify.icons.tech" name="Tech Attack" :value="frame.TechAttack" />
      <cc-statblock-panel
        icon="$vuetify.icons.repair"
        name="Repair Capacity"
        :value="frame.RepCap"
      />
      <cc-statblock-panel icon="$vuetify.icons.save" name="Save Target" :value="frame.SaveTarget" />
      <cc-statblock-panel icon="$vuetify.icons.speed" name="Speed" :value="frame.Speed" />
      <cc-statblock-panel icon="$vuetify.icons.sp" name="System Points" :value="frame.SP" />
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
