<template>
  <v-row justify="center"
    dense>
    <frame-statblock-item icon="cc:structure"
      name="Structure"
      :value="frame.Structure"
      cols="5" />
    <frame-statblock-item icon="mdi-heart-outline"
      name="HP"
      :value="frame.HP"
      cols="3" />
    <frame-statblock-item icon="mdi-shield-outline"
      name="Armor"
      :value="frame.Armor"
      cols="4" />

    <frame-statblock-item icon="cc:reactor"
      name="Stress"
      :value="frame.HeatStress"
      cols="6" />
    <frame-statblock-item icon="cc:heat"
      name="Heat Capacity"
      :value="frame.HeatCap"
      cols="6" />

    <frame-statblock-item icon="cc:evasion"
      name="Evasion"
      :value="frame.Evasion"
      cols="6" />
    <frame-statblock-item icon="mdi-arrow-right-bold-hexagon-outline"
      name="Speed"
      :value="frame.Speed"
      cols="6" />

    <frame-statblock-item icon="cc:edef"
      name="E-Defense"
      :value="frame.EDefense"
      cols="6" />
    <frame-statblock-item icon="cc:full_tech"
      name="Tech Attack"
      :value="frame.TechAttack"
      cols="6" />

    <frame-statblock-item icon="cc:sensor"
      name="Sensors"
      :value="frame.SensorRange" />
    <frame-statblock-item icon="cc:repair"
      name="Repair Capacity"
      :value="frame.RepCap"
      cols="6" />

    <frame-statblock-item icon="cc:save"
      name="Save Target"
      :value="frame.SaveTarget"
      cols="6" />
    <frame-statblock-item icon="cc:system_point"
      name="System Points"
      :value="frame.SP"
      cols="6" />
  </v-row>
</template>

<script setup lang="ts">
import { Frame } from '@/classes/mech/components/frame/Frame'
import FrameStatblockItem from './_FrameStatblockItem.vue'

defineProps<{
  frame: Frame
}>()
</script>
