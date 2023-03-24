<template>
  <print-card-base :item="item">
    <v-row slot="top" no-gutters justify="space-between">
      <v-col cols="auto" class="heading h4" v-text="item.Name" />
    </v-row>
    <div class="caption" v-html="`<b>Trigger:</b> ${item.Feature.Trigger}`" />
  </print-card-base>
</template>

<script lang="ts">
import PrintCardBase from './_PrintCardBase.vue';

export default {
  name: 'npc-trait-card',
  components: { PrintCardBase },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>
