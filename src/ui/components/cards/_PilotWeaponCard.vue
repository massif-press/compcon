<template>
  <equipment-card-base :item="item">
    <v-col cols="auto">
      <cc-range-element :range="item.Range" />
    </v-col>
    <v-divider vertical class="mx-4" />
    <v-col cols="auto">
      <cc-damage-element :damage="item.Damage" :type-override="item.DamageTypeOverride" />
    </v-col>
  </equipment-card-base>
</template>

<script lang="ts">
import Vue from 'vue'
import EquipmentCardBase from './_EquipmentCardBase.vue'

export default Vue.extend({
  name: 'cc-pilot-weapon-card',
  components: { EquipmentCardBase },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
})
</script>
