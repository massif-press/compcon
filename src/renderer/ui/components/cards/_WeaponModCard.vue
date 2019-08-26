<template>
  <equipment-card-base :item="item">
    <v-flex v-if="item.AddedRange" shrink class="mx-3">
      <cc-range-element :range="[item.AddedRange]" />
    </v-flex>
    <v-flex v-if="item.AddedDamage" shrink class="mx-3">
      <cc-damage-element :damage="[item.AddedDamage]" />
    </v-flex>
    <v-flex v-if="item.SP">
      <span class="large-text">
        <b class="primary--text">{{ item.SP }}</b>
        SP
      </span>
    </v-flex>
    <v-spacer />
    <v-flex shrink class="mx-3">
      <div class="large-text">{{ item.AppliedString }}</div>
      <div v-if="item.Restricted">
        <br />
        <span class="stat-text error--text">
          RESTRICTED: {{ item.Restricted.join('/').toUpperCase() }} MOUNTS
        </span>
      </div>
    </v-flex>
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
