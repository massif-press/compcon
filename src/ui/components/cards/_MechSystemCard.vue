<template>
  <equipment-card-base :item="item" :notes="notes">
    <v-col v-if="item.SP" cols="auto" class="text-center">
      <div class="panel clipped">
        <v-icon v-for="n in item.SP" :key="`${item.ID}_sp-${n}`" x-large>cci-system-point</v-icon>
      </div>
      <span class="overline">
        <b>{{ item.SP }}</b>
        SYSTEM POINT{{ item.SP > 1 ? 'S' : '' }}
      </span>
    </v-col>
    <v-col v-if="item.LicenseString" cols="auto" class="ml-auto text-right">
      <div class="heading h2">{{ item.Type }}</div>
      <span class="flavor-text subtle--text">// {{ item.LicenseString }}</span>
      <div v-if="item.InLcp" class="flavor-text subtle--text">{{ item.LcpName }}</div>
    </v-col>
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
    notes: { type: Boolean },
  },
})
</script>
