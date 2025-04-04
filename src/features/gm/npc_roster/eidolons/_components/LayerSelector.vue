<template>
  <v-card-text v-if="!hasLayerData" class="mt-n4">
    <v-container>
      <div style="min-height: 20vh; width: 700px; margin: auto" class="py-4">
        <div class="heading h2 mb-2 text-center pb-4">No Eidolon data found!</div>

        Eidolon data are included with the No Room for a Wallflower Campaign Book and are therefore
        not included with COMP/CON by default. You can find Eidolon data as additional downloadable
        content on the
        <a href="https://massif-press.itch.io/no-room-for-a-wallflower-act-1">
          No Room for a Wallflower
        </a>
        Campaign Book page.
        <br />
        <br />
        If you have already downloaded the Eidolon data, you can import it into COMP/CON via the
        Content Manager available on the Main Menu or in the Options menu on the right side of the
        nav bar.
      </div>
    </v-container>
  </v-card-text>
  <cc-compendium-browser
    v-else
    ref="browser"
    :items="layers"
    item-type="EidolonLayer"
    :table-headers="headers"
    :options="options"
    equippable
    @equip="AddLayer($event)">
    <template #header><div class="heading h3 text-center text-accent">Mech Weapons</div></template>
    <template #top>
      <cc-switch
        v-model="allowDupes"
        label="Allow Duplicates"
        color="error"
        on-icon="mdi-lock-open"
        off-icon="mdi-lock" />
    </template>
  </cc-compendium-browser>
</template>

<script lang="ts">
import { CompendiumStore } from '@/stores';

export default {
  name: 'npc-class-selector',
  props: {
    item: { type: Object, required: true },
    readonly: { type: Boolean, default: false },
  },
  data: () => ({
    allowDupes: false,
    options: {
      views: ['single', 'table', 'cards'],
      initialView: 'single',
      groups: ['lcp'],
      initialGroup: 'none',
    },
    headers: [
      { title: 'Content Pack', key: 'LcpName' },
      { title: 'Name', key: 'Name' },
      {
        title: 'Shards',
        key: 'ShardCount',
      },
    ],
  }),
  emits: ['add-layer'],
  computed: {
    hasLayerData() {
      return CompendiumStore().EidolonLayers.length > 0;
    },
    layers() {
      const layers = this.allowDupes
        ? CompendiumStore().EidolonLayers
        : CompendiumStore().EidolonLayers.filter(
            (x) => !this.item.Layers.some((y) => x.ID === y.ID)
          );
      return layers;
    },
  },
  methods: {
    AddLayer(layer) {
      this.$emit('add-layer', layer);
    },
  },
};
</script>
