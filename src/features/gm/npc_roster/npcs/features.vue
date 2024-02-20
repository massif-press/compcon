<template>
  <div class="text-overline pt-2">FEATURES</div>
  <div v-if="item.NpcClassController.HasClass">
    <npc-feature-alerts :template-controller="item.NpcTemplateController" expanded />

    <v-row dense>
      <cc-dense-card
        v-for="f in item.NpcFeatureController.Features"
        :item="f"
        class="my-1"
        :min-width="getMinWidth(f)"
        full-height
        collapse-actions
        :tier="item.NpcClassController.Tier" />
    </v-row>

    <npc-feature-selector :npc="item" />
  </div>
  <v-card v-else variant="outlined" class="pa-1" style="border-color: rgb(var(--v-theme-panel))">
    <div class="text-center text-disabled text-caption pa-2">
      <i>Select a Class to add Features</i>
    </div>
  </v-card>
</template>

<script lang="ts">
import { NpcFeatureSelector } from './_components';
import NpcFeatureAlerts from './_components/NpcFeatureAlerts.vue';

export default {
  name: 'npc-builder-content',
  components: {
    NpcFeatureSelector,
    NpcFeatureAlerts,
  },
  props: {
    item: { type: Object, required: true },
  },
  methods: {
    getMinWidth(b: any) {
      if (b.EffectLength > 600) return '60vw';
      if (b.EffectLength > 400) return '40vw';
      return '30vw';
    },
  },
};
</script>
