<template>
  <v-row justify="center" dense>
    <cc-statblock-panel icon="cc:structure" name="Structure" :value="frame.Structure" cols="5" />
    <cc-statblock-panel icon="mdi-heart-outline" name="HP" :value="frame.HP" cols="3" />
    <cc-statblock-panel icon="mdi-shield-outline" name="Armor" :value="frame.Armor" cols="4" />
    <cc-statblock-panel icon="cc:reactor" name="Stress" :value="frame.HeatStress" cols="4" />
    <cc-statblock-panel icon="cc:heat" name="Heat Capacity" :value="frame.HeatCap" cols="8" />
    <cc-statblock-panel icon="cc:evasion" name="Evasion" :value="frame.Evasion" cols="6" />
    <cc-statblock-panel
      icon="mdi-arrow-right-bold-hexagon-outline"
      name="Speed"
      :value="frame.Speed"
      cols="6" />
    <cc-statblock-panel icon="cc:e_def" name="E-Defense" :value="frame.EDefense" cols="5" />
    <cc-statblock-panel icon="cc:full_tech" name="Tech Attack" :value="frame.TechAttack" cols="7" />

    <cc-statblock-panel icon="cc:sensor" name="Sensors" :value="frame.SensorRange" cols="4" />

    <cc-statblock-panel icon="cc:repair" name="Repair Capacity" :value="frame.RepCap" cols="8" />
    <cc-statblock-panel icon="cc:save" name="Save Target" :value="frame.SaveTarget" cols="6" />

    <cc-statblock-panel icon="cc:system_point" name="System Points" :value="frame.SP" cols="6" />
  </v-row>
</template>

<script lang="ts">
export default {
  name: 'cc-frame-statblock',
  props: {
    frame: {
      type: Object,
      required: true,
    },
  },
};
</script>
