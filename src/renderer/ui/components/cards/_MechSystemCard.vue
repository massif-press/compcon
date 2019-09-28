<template>
  <equipment-card-base :item="item">
    <span v-if="item.SP" span class="large-text">
      <b class="primary--text">{{ item.SP }}</b>
      SP
    </span>
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
