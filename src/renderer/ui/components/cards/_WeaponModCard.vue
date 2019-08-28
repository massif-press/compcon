<template>
  <equipment-card-base :item="item">
    <cc-range-element v-if="item.AddedRange" :range="[item.AddedRange]" />
    <cc-damage-element v-if="item.AddedDamage" :damage="[item.AddedDamage]" />
    <span v-if="item.SP" class="large-text">
      <b class="primary--text">{{ item.SP }}</b>
      SP
    </span>
    <div class="large-text ml-auto">{{ item.AppliedString }}</div>
    <div v-if="item.Restricted">
      <br />
      <span
        class="stat-text error--text"
      >RESTRICTED: {{ item.Restricted.join('/').toUpperCase() }} MOUNTS</span>
    </div>
  </equipment-card-base>
</template>

<script lang="ts">
import Vue from 'vue'
import EquipmentCardBase from './_EquipmentCardBase.vue'

export default Vue.extend({
  name: 'cc-weapon-mod-card',
  components: { EquipmentCardBase },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
})
</script>
