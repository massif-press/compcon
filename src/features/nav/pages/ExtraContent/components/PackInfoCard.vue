<template>
  <v-card-text>
    <v-row>
      <v-col>
        <p class="body-text text-text light-panel pa-2 mb-1">
          <span v-if="manifest.description" v-html-safe="manifest.description" />
          <span v-else>No description given.</span>
        </p>
        <div>
          <h4>Content</h4>
          <div>
            <v-chip
              v-for="item in packContents"
              variant="outlined"
              color="secondary"
              size="small"
              class="mr-2 mb-1 text-overline"
            >
              <v-avatar color="secondary" start v-text="item.count" />
              {{ item.name }}
            </v-chip>
          </div>
        </div>
      </v-col>
      <v-col cols="12" md="4">
        <v-img :src="manifest.image_url" max-height="300px" />
        <div v-if="manifest.website" class="mt-2">
          <v-btn
            target="_blank"
            :href="manifest.website"
            color="secondary"
            variant="outlined"
            size="small"
            block
          >
            <v-icon prepend class="mr-1">mdi-open-in-new</v-icon>
            &nbsp;Website
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-card-text>
</template>

<script lang="ts">
import { ContentPack } from '@/class';
import { IContentPack } from '@/interface';
import _ from 'lodash';
import { PropType } from 'vue';

export default {
  props: {
    pack: { type: Object as PropType<IContentPack | ContentPack>, required: true },
  },
  data: () => ({
    humanReadableMap: {
      manufacturers: ['manufacturer', 'manufacturers'],
      coreBonuses: ['core bonus', 'core bonuses'],
      frames: ['frame', 'frames'],
      weapons: ['weapon', 'weapons'],
      systems: ['system', 'systems'],
      mods: ['weapon mod', 'weapon mods'],
      pilotGear: ['pilot gear item', 'pilot gear items'],
      backgrounds: ['background', 'backgrounds'],
      bonds: ['bond', 'bonds'],
      reserves: ['reserve', 'reserves'],
      talents: ['pilot talent', 'pilot talents'],
      tags: ['equipment tag', 'equipment tags'],
      npcClasses: ['NPC class', 'NPC classes'],
      npcFeatures: ['NPC feature', 'NPC features'],
      npcTemplates: ['NPC template', 'NPC templates'],
      actions: ['Player action', 'Player actions'],
      statuses: ['Status/Condition', 'Statuses/Conditions'],
      environments: ['Combat Environment', 'Combat Environments'],
      factions: ['faction', 'factions'],
      sitreps: ['SITREP', 'SITREPs'],
      tables: ['Data Table', 'Data Tables'],
    },
  }),

  computed: {
    manifest() {
      return (this.pack as IContentPack).manifest
        ? (this.pack as IContentPack).manifest
        : (this.pack as ContentPack).Manifest;
    },
    packContents() {
      const data = (this.pack as IContentPack).data
        ? (this.pack as IContentPack).data
        : (this.pack as ContentPack).Data;
      return _.toPairs(data)
        .map(([key, value]: [string, object[]]) => {
          const count = value.length;
          return [key, count];
        })
        .filter(([, count]) => Number(count) > 0)
        .map(([key, count]) => {
          const pair = this.humanReadableMap[key];
          if (!pair) return { count, name: `${key}--NOT--HUMANIZED` };
          const [singular, plural]: [string, string] = pair;
          return { count, name: Number(count) > 1 ? plural : singular };
        });
    },
  },
};
</script>
