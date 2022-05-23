<template>
  <print-card-base :item="item">
    <v-row slot="top" no-gutters justify="space-between">
      <v-col cols="auto" class="heading h4" v-text="item.Name" />
    </v-row>
    <div v-html-safe="item.Feature.EffectByTier(item.Tier)" class="pb-1 caption" />
  </print-card-base>
</template>

<script lang="ts">
import Vue from 'vue'
import PrintCardBase from './_PrintCardBase.vue'

export default Vue.extend({
  name: 'npc-system-print-card',
  components: { PrintCardBase },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
})
</script>
