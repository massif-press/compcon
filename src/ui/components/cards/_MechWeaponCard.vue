<template>
  <equipment-card-base :item="item">
    <v-col cols="auto">
      <cc-range-element :range="item.Range" />
    </v-col>
    <v-divider vertical class="mx-4" />
    <v-col cols="auto">
      <cc-damage-element :damage="item.Damage" />
    </v-col>
    <v-divider v-if="item.BaseSP" vertical class="mx-4" />
    <v-col v-if="item.BaseSP" cols="auto" class="text-center">
      <div class="clip-icon">
        <v-icon v-for="n in item.BaseSP" :key="`${item.ID}_sp-${n}`" x-large>mdi-flash</v-icon>
      </div>
      <span>
        <b>{{ item.BaseSP }}</b>
        <br />
        <div class="overline mt-n1">
          SYSTEM POINTS
        </div>
      </span>
    </v-col>
    <v-col cols="auto" class="ml-auto text-right">
      <div class="heading h2">{{ item.Size }} {{ item.Type }}</div>
      <span v-if="item.Source" class="flavor-text grey--text">// {{ item.LicenseString }}</span>
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
