<template>
  <v-alert outlined dense :color="item.Color" class="light-panel pb-1">
    <v-row
      v-if="item.ItemType === 'MechWeapon'"
      class="stark--text mb-n3"
      no-gutters
      align="center"
    >
      <v-col>
        <v-icon large left class="mt-n2">cci-weapon</v-icon>
        <span class="heading h3">{{ item.Name }}</span>
      </v-col>
      <v-col cols="auto" class="ml-auto">
        <span class="overline">INTEGRATED MECH WEAPON</span>
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
  },
})
</script>
