<template>
  <v-container v-if="!layers.length"
    class="px-12">
    <v-alert icon="cc:monist"
      title="No Eidolon Data"
      variant="tonal">
      <!-- eslint-disable @intlify/vue-i18n/no-raw-text -->
      <!-- Theme L §4: core-book rules flavor, localized via the content pipeline (L3), not a UI key. -->
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
      <!-- eslint-enable @intlify/vue-i18n/no-raw-text -->
    </v-alert>
    <br />
    <v-row align="center"
      justify="center">
      <v-col cols="auto">
        <cc-button color="accent"
          to="/srd">{{ $t('compendium.returnToCompendium') }}</cc-button>
      </v-col>
    </v-row>
  </v-container>
  <cc-compendium-browser v-else
    ref="browser"
    :items="layers"
    item-type="EidolonLayer"
    :table-headers="headers"
    :options="options"
    view-key="cb-eidolon-layers" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { CompendiumStore } from '@/stores';
import { EidolonLayer } from '@/classes/npc/eidolon/EidolonLayer';

const browser = ref<any>(null)

const selectedTier = ref(1)
const tieredView = ref(false)
const options = ref({
      views: ['single', 'table', 'cards'],
      initialView: 'single',
      groups: ['lcp', 'none'],
      initialGroup: 'none',
    })
const headers = ref([
      { title: 'Content Pack', key: 'LcpName' },
      { title: 'Name', key: 'Name' },
      {
        title: 'Shards',
        key: 'ShardCount',
      },
    ])

const layers = computed(() => {
      return CompendiumStore().EidolonLayers;
    })
</script>
