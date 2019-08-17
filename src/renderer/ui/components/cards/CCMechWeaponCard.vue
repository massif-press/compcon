<template>
  <cc-mech-equipment-card-base :item="item">
    <v-flex shrink class="mx-3">
      <cc-range-element :range="item.Range" />
    </v-flex>
    <v-flex shrink class="mx-3">
      <cc-damage-element :damage="item.Damage" />
    </v-flex>
    <v-flex v-if="item.SP">
      <span class="text-lighten--text">({{item.SP}} SP)</span>
    </v-flex>
    <v-spacer />
    <v-flex shrink class="mx-3">
      <div class="large-text">{{item.Size}} {{item.Type}}</div>
    </v-flex>
  </cc-mech-equipment-card-base>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'cc-mech-weapon-card',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
})
</script>