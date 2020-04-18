<template>
  <equipment-card-base :item="item">
    <v-col cols="auto">
      <cc-range-element :range="item.Range" />
    </v-col>
    <v-divider v-if="item.Range.length && item.Damage.length" vertical class="mx-4" />
    <v-col cols="auto">
      <cc-damage-element :damage="item.Damage" :type-override="item.DamageTypeOverride" />
    </v-col>
    <v-divider v-if="item.SP" vertical class="mx-4" />
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
      <div class="heading h2">{{ item.Size }} {{ item.Type }}</div>
      <span v-if="item.Source" class="flavor-text subtle--text">// {{ item.LicenseString }}</span>
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
