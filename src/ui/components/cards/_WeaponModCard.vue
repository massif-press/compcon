<template>
  <equipment-card-base :item="item">
    <v-col v-if="item.AddedRange" cols="auto">
      <cc-range-element :range="[item.AddedRange]" />
    </v-col>
    <v-divider v-if="item.AddedRange" vertical class="mx-4" />
    <v-col v-if="item.AddedDamage" cols="auto">
      <cc-damage-element :damage="[item.AddedDamage]" />
    </v-col>
    <v-divider v-if="item.AddedDamage" vertical class="mx-4" />
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
      <span class="overline">APPLIED TO</span>
      <div class="heading h2 mt-n2">{{ item.AppliedString }}</div>
      <span class="flavor-text subtle--text">// {{ item.LicenseString }}</span>
      <div v-if="item.Restricted">
        <span class="stat-text error--text">
          RESTRICTED: {{ item.Restricted.join('/').toUpperCase() }} MOUNTS
        </span>
      </div>
    </v-col>
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
