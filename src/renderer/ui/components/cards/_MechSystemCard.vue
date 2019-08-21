<template>
  <mech-equipment-card-base :item="item">
    <v-flex v-if="item.SP">
      <span class="large-text">
        <b class="primary--text">{{item.SP}}</b> SP
      </span>
    </v-flex>
    <v-spacer />
    <v-flex shrink class="mx-3">
      <div class="large-text">{{item.Size}} {{item.Type}}</div>
    </v-flex>
  </mech-equipment-card-base>
</template>

<script lang="ts">
import Vue from 'vue'
import MechEquipmentCardBase  from './_MechEquipmentCardBase.vue'

export default Vue.extend({
  name: 'cc-mech-weapon-card',
  components: { MechEquipmentCardBase },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
})
</script>