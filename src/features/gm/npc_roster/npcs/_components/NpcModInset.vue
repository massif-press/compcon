<template>
  <v-card flat tile class="mb-n3">
    <v-toolbar height="20" flat color="mod">
      <div class="text-caption text-uppercase">
        <v-icon style="padding-bottom: 1px" class="mx-1" icon="cc:weaponmod"></v-icon>
        <b>{{ mod.Name }}</b>
      </div>
    </v-toolbar>
    <div class="py-1 px-2">
      {{ mod.Mod.AddEffect }}
      <cc-bonus v-for="bonus in mod.Mod.AddBonuses" :bonus="bonus" />
      <cc-tags v-for="tag in mod.Mod.AddTags" :tag="tag" />
      <cc-deployable v-for="deployable in mod.Mod.AddDeployables" :deployable="deployable" />
    </div>
  </v-card>
</template>

<script lang="ts">
export default {
  name: 'npc-mod-inset',
  props: { mod: { type: Object, required: true } },
};
</script>
