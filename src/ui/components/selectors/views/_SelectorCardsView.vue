<template>
  <v-container fluid>
    <div v-for="s in sources" :key="s.ID">
      <v-row v-if="s.Name" no-gutters align="center" justify="center">
        <v-col cols="auto">
          <cc-logo
            :size="$vuetify.display.mdAndUp ? 'xLarge' : 'large'"
            :source="s"
            class="mb-n2"
          />
        </v-col>
      </v-row>
      <v-row v-else-if="!!s" align="center" justify="center">
        <v-col cols="auto">
          <div :class="`heading ${$vuetify.display.mdAndDown ? 'h3' : 'h1'}`">
            {{ s.match(/[A-Z]*[^A-Z]+/g).join(' ') }}
          </div>
        </v-col>
      </v-row>
      <v-row align="center" justify="center" class="mt-0 mb-3">
        <compendium-card
          v-for="item in itemsBySource(s.ID)"
          :key="`card_${item.ID}`"
          :item="item"
          :small="$vuetify.display.smAndDown"
          :equipment-add="equipmentAdd"
          @equip="$emit('equip', $event)"
        />
      </v-row>
    </div>
  </v-container>
</template>

<script lang="ts">
import _ from 'lodash';

import { CompendiumStore } from '@/store';
import CompendiumCard from './components/CompendiumCard.vue';

export default {
  name: 'selector-cards-view',
  components: { CompendiumCard },
  props: {
    items: {
      type: Array,
      required: true,
    },
    equipmentAdd: { type: Boolean },
  },
  data: () => ({
    selected: null,
  }),
  computed: {
    compendium() {
      return this.getModule(CompendiumStore);
    },
    sources() {
      if (this.equipmentAdd) {
        return [''];
      }
      if (!this.items.some((x) => !x.Source)) {
        const sources = _.uniq(this.items.map((x) => x.Source));
        return sources.map((x: string) =>
          this.compendium.Manufacturers.find((y) => y.ID === x.toUpperCase())
        );
      }
      return [''];
    },
  },
  methods: {
    itemsBySource(s) {
      if (!s) return this.items;
      if (this.equipmentAdd) return this.items.filter((x) => x.ItemType === s);
      return this.items.filter((x) => x.Source === s);
    },
  },
};
</script>
