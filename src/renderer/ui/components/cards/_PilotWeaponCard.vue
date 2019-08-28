<template>
  <equipment-card-base :item="item">
    <cc-range-element :range="item.Range" />
    <cc-damage-element :damage="item.Damage" />
    <div class="large-text ml-auto">{{ item.Size }} {{ item.Type }}</div>
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
