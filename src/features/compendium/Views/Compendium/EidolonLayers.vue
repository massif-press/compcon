<template>
  <v-container v-if="!layers.length" class="px-12">
    <v-alert icon="cc:monist" title="No Eidolon Data" variant="tonal">
      <p>
        <strong>Eidolons</strong>
        are complex and otherworldly enemies meant to provide a unique, puzzle-like combat
        experience. They are fearsome foes that, at their most powerful, are more than the match for
        a whole group of lancers.
      </p>
      <br />
      <p>
        Eidolons are not part of the core Lancer rules, and are therefore not included with COMP/CON
        by default. You can find the rules for Eidolons in the
        <a href="https://massif-press.itch.io/no-room-for-a-wallflower-act-1">
          No Room for a Wallflower
        </a>
        campaign book, and you can add them to COMP/CON by installing the GM LCP for No Room for a
        Wallflower, available alongside the PDF download.
      </p>
    </v-alert>
    <br />
    <v-row align="center" justify="center">
      <v-col cols="auto">
        <cc-button color="accent" to="/srd">Return to Compendium</cc-button>
      </v-col>
    </v-row>
  </v-container>
  <cc-compendium-browser
    v-else
    ref="browser"
    :items="layers"
    item-type="EidolonLayer"
    :table-headers="headers"
    :options="options" />
</template>

<script lang="ts">
import { CompendiumStore } from '@/stores';
import { EidolonLayer } from '@/classes/npc/eidolon/EidolonLayer';

export default {
  name: 'EidolonLayers',

  data: () => ({
    selectedTier: 1,
    tieredView: false,
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

  computed: {
    layers(): EidolonLayer[] {
      return CompendiumStore().EidolonLayers;
    },
  },
};
</script>
