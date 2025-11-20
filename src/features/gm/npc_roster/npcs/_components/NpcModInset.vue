<template>
  <v-card
    flat
    tile
    class="mb-1 bg-panel"
    style="border: 1px solid; border-color: rgb(var(--v-theme-mod))">
    <v-toolbar height="20" flat color="mod">
      <div class="text-caption text-uppercase">
        <v-icon style="padding-bottom: 1px" class="mx-1" icon="cc:weaponmod"></v-icon>
        <b>{{ mod.Name }}</b>
      </div>
    </v-toolbar>
    <div class="pa-0">
      <p v-if="mod.Effect" class="py-1 px-2" v-html-safe="mod.EffectByTier(tier)" />
      <cc-bonus v-for="bonus in mod.Bonuses" :bonus="bonus" />
      <cc-tags v-for="tag in mod.Tags" :tag="tag" />
      <cc-deployable v-for="deployable in mod.Deployables" :deployable="deployable" />
      <cc-action v-for="action in mod.Actions" :action="action" panel />
    </div>
  </v-card>
</template>

<script lang="ts">
export default {
  name: 'npc-mod-inset',
  props: {
    mod: { type: Object, required: true },
    tier: { type: Number, required: false, default: 1 },
  },
};
</script>
