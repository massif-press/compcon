<template>
  <c-card-base :item="item" :small="small" :hover="hover">
    <v-row slot="top" no-gutters justify="space-around" align="center">
      <v-col v-if="item.Damage && item.Damage[0]" cols="auto">
        <cc-damage-element :damage="item.Damage" />
      </v-col>
      <v-col v-if="item.Range" cols="auto">
        <cc-range-element :range="item.Range" />
      </v-col>
    </v-row>
    <span slot="overline">{{ item.Size }} {{ item.WeaponType }}</span>
  </c-card-base>
</template>

<script lang="ts">
import Vue from 'vue'
import CCardBase from './_cCardBase.vue'
export default Vue.extend({
  name: 'weapon-card-content',
  components: { CCardBase },
  props: {
    item: { type: Object, required: true },
    small: { type: Boolean },
    hover: { type: Boolean },
  },
})
</script>
