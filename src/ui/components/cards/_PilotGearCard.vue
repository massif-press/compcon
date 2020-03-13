<template>
  <equipment-card-base :item="item">
    <span class="large-text">
      <b class="accent--text">{{ item.uses ? item.uses : 'Unlimited' }}</b>
      Use{{ !item.uses || item.uses > 1 ? 's' : '' }}
    </span>
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
