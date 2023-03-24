<template>
  <v-container v-if="item.NpcClassController.HasClass">
    <npc-feature-alerts :item="item" />
    <npc-feature-selector :npc="item" />
  </v-container>
</template>

<script lang="ts">
import { NpcFeatureAlerts, NpcFeatureSelector } from './_components';

export default {
  name: 'npc-builder-content',
  components: {
    NpcFeatureAlerts,
    NpcFeatureSelector,
  },
  props: {
    item: { type: Object, required: true },
  },
};
</script>
