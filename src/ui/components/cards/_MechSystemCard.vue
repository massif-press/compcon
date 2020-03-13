<template>
  <equipment-card-base :item="item">
    <v-col v-if="item.SP" cols="auto" class="text-center">
      <div class="clip-icon">
        <v-icon v-for="n in item.SP" :key="`${item.ID}_sp-${n}`" x-large>mdi-flash</v-icon>
      </div>
      <span>
        <b>{{ item.SP }}</b>
        <br />
        <div class="overline mt-n1">
          SYSTEM POINTS
        </div>
      </span>
    </v-col>
    <v-col cols="auto" class="ml-auto text-right">
      <div class="heading h2">{{ item.Type }}</div>
      <span class="flavor-text subtle--text">// {{ item.LicenseString }}</span>
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
  },
})
</script>
