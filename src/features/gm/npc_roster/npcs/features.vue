<template>
  <div class="text-overline pt-2">FEATURES</div>
  <div v-if="item.NpcClassController.HasClass">
    <npc-feature-alerts :item="item" />
    <npc-feature-selector :npc="item" />
  </div>
  <v-card v-else variant="outlined" class="pa-1" style="border-color: rgb(var(--v-theme-panel))">
    <div class="text-center text-disabled text-caption pa-2">
      <i>Select a Class to add Features</i>
    </div>
  </v-card>
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
