<template>
  <v-container fluid>
    <div v-for="s in sources">
      <v-row v-if="s.Name" no-gutters align="center" justify="center">
        <v-col cols="auto">
          <v-icon
            size="60"
            :color="s.GetColor($vuetify.theme.current.dark)"
            :icon="`cc:${s.Icon}`"
          />
        </v-col>
        <v-col cols="auto">
          <div
            :class="`heading ${$vuetify.display.mdAndDown ? 'h3' : 'h1'}`"
            :style="`color: ${s.GetColor($vuetify.theme.current.dark)}`"
          >
            {{ s.Name }}
          </div>
        </v-col>
      </v-row>
      <v-row align="center" justify="center" class="mt-0 mb-3">
        <compendium-card
          :item="(item as any)"
          :small="$vuetify.display.smAndDown"
        />
      </v-row>
    </div>
  </v-container>
</template>

<script lang="ts">
import _ from 'lodash';

import { CompendiumStore } from '@/stores';
import CompendiumCard from './components/CompendiumCard.vue';

export default {
  name: 'compendium-cards-view',
  components: { CompendiumCard },
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    selected: null,
  }),
  computed: {
    compendium() {
      return CompendiumStore();
    },
    sources(): any[] {
      if (!this.items.some((x: any) => !x.Source)) {
        const sources = _.uniq(this.items.map((x: any) => x.Source));
        return sources.map((x: string) => {
          const s = this.compendium.Manufacturers.find(
            (y) => y.ID === x.toUpperCase()
          );
          return s || x;
        });
      }
      return [''];
    },
  },
  methods: {
    itemsBySource(s) {
      if (!s) return this.items;
      return this.items.filter((x: any) => x.Source === s);
    },
  },
};
</script>
