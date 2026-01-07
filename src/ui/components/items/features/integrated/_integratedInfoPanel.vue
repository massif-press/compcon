<template>
  <v-alert outlined dense :color="item.Color" class="light-panel pb-1">
    <v-row
      class="stark--text mb-n3"
      no-gutters
      align="center"
    >
      <v-col>
        <v-icon large left class="mt-n2">
          {{(item.ItemType === 'MechWeapon') ? 'cci-weapon' : (item.ItemType === 'MechSystem') ? 'cci-system' : 'cci-weaponmod'}}
        </v-icon>
        <span class="heading h3">{{ item.Name }}</span>
      </v-col>
      <v-col cols="auto" class="ml-auto">
        <span class="overline">{{special ? 'SPECIAL ' : 'INTEGRATED'}} {{(item.ItemType === 'MechWeapon') ? 'MECH WEAPON' : (item.ItemType === 'MechSystem') ? 'MECH SYSTEM' : 'WEAPON MOD'}}</span>
      </v-col>
    </v-row>
    <integrated-info-base :item="item" />
  </v-alert>
</template>

<script lang="ts">
import Vue from 'vue'
import integratedInfoBase from './_integratedInfoBase.vue'

export default Vue.extend({
  name: 'integrated-info-panel',
  components: { integratedInfoBase },
  props: {
    item: {
      type: Object,
      required: true,
    },
    special: {
      type: Boolean,
      default: false,
    },
  },
})
</script>
