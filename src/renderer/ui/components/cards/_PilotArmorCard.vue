<template>
  <equipment-card-base :item="item">
    <v-flex shrink class="mx-3">
      <cc-range-element :range="item.Range" />
    </v-flex>
    <v-flex shrink class="mx-3">
      <cc-damage-element :damage="item.Damage" />
    </v-flex>
    <v-flex v-if="item.SP">
      <span class="text-lighten--text">({{ item.SP }} SP)</span>
    </v-flex>
    <v-spacer />
    <v-flex shrink class="mx-3">
      <div class="large-text">{{ item.Size }} {{ item.Type }}</div>
    </v-flex>
    <v-container slot="statblock" grid-list-md class="mt-0 pt-1">
      <v-layout justify-space-between wrap fill-height>
        <cc-statblock-panel name="Armor" :value="item.Armor" />
        <cc-statblock-panel name="HP Bonus" :value="`+ ${item.HPBonus}`" />
        <cc-statblock-panel name="E-Defense" :value="item.EDefense" />
        <cc-statblock-panel name="Evasion" :value="item.Evasion" />
        <cc-statblock-panel name="Speed" :value="item.Speed" />
      </v-layout>
    </v-container>
  </equipment-card-base>
</template>

<script lang="ts">
import Vue from 'vue'
import EquipmentCardBase from './_EquipmentCardBase.vue'

export default Vue.extend({
  name: 'cc-mech-weapon-card',
  components: { EquipmentCardBase },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
})
</script>
