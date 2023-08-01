<template>
  <v-container v-if="!bonds.length" class="px-12">
    <v-alert icon="mdi-vector-link" title="No Bond Data" variant="tonal">
      <p>
        <strong>Bonds</strong> are an optional set of narrative play rules that layer on top of the
        basic Lancer narrative play rules, tweak some of them, and add a little more depth and
        nuance. Lancer’s default narrative rules are very light to keep the focus on mech combat and
        to provide a flexible and familiar framework for GMs to work with. The bond systems give
        players some additional progression, powers that give them more narrative agency, an easier
        way to track tasks and challenges, and an experience system to incentivize role-playing.
      </p>
      <br />
      <p>
        Bonds are not part of the core Lancer rules, and are therefore not included with COMP/CON by
        default. You can find the rules for bonds in the
        <a href="https://massif-press.itch.io/field-guide-the-karrakin-trade-baronies"
          >Field Guide to the Karrakin Trade Baronies</a
        >, and you can add them to COMP/CON by installing the LCP for The Karrakin Trade Baronies,
        available for free on the itch page.
      </p>
    </v-alert>
    <br />
    <v-row align="center" justify="center">
      <v-col cols="auto">
        <v-btn color="primary" to="/srd/compendium">Return to Compendium</v-btn>
      </v-col>
    </v-row>
  </v-container>
  <compendium-browser :items="bonds" item-type="Bond" :options="options">
    <template #header> <div class="heading h3 text-center text-primary">Pilot Bonds</div></template>
  </compendium-browser>
</template>

<script lang="ts">
import { CompendiumStore } from '@/stores';
import { Bond } from '@/class';
import CompendiumBrowser from '../../components/CompendiumBrowser.vue';

export default {
  name: 'bonds',
  computed: {
    bonds(): Bond[] {
      return CompendiumStore().Bonds;
    },
  },
  data: () => ({
    options: {
      views: ['single', 'table'],
      initialView: 'single',
      groups: ['lcp'],
      initialGroup: 'lcp',
      noSource: true,
      hideTitle: true,
    },
  }),
  methods: {
    scrollTo(e: any): void {
      const el = document.getElementById(`e_${e.Name.replace(/\W/g, '')}`);
      if (el) {
        const yOffset = -60;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    },
  },
  components: { CompendiumBrowser },
};
</script>
