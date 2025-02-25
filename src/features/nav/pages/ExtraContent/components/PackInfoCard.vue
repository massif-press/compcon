<template>
  <v-card-text :class="mobile && 'pa-0 pb-2'">
    <v-row>
      <v-col>
        <p class="body-text text-text light-panel pa-2 mb-1">
          <span v-if="manifest.description" v-html-safe="manifest.description" />
          <span v-else>No description given.</span>
        </p>
        <div>
          <cc-heading line>CONTENT</cc-heading>
          <div>
            <v-chip
              v-for="item in packContents"
              variant="outlined"
              color="accent"
              size="small"
              class="mr-2 mb-1 text-overline rounded-s-full rounded-e-0">
              <v-avatar color="primary" start v-text="item.count" />
              {{ item.name }}
            </v-chip>
          </div>
        </div>
        <div class="pt-2">
          <cc-heading line>
            DEPENDENCIES
            <cc-tooltip
              text="Dependencies are other content packs that this pack requires to function properly.
              They must be installed and activated for this pack to load correctly." />
          </cc-heading>
          <i v-if="packDependencies.length === 0" class="pl-2">None</i>
          <div v-else>
            <v-card
              v-for="item in packDependencies"
              :variant="d(item).installed ? 'outlined' : 'tonal'"
              :color="d(item).installed ? 'secondary' : 'error'"
              size="small"
              class="ma-1 pa-1">
              <div class="font-weight-bold">
                <v-icon
                  :icon="d(item).installed ? 'mdi-check' : 'mdi-close'"
                  :color="d(item).installed ? 'success' : 'error'"
                  class="mr-1" />
                {{ d(item).name }} @ {{ d(item).version }}
              </div>
              <div
                class="text-caption px-2"
                v-html="
                  d(item).installed
                    ? 'Dependency installed'
                    : `${manifest.name} requires Lancer Content Pack <b>${
                        d(item).name
                      } at version ${d(item).version}</b> to be installed before it can be loaded.`
                " />
              <div v-if="d(item).link" class="text-caption px-2 text-right">
                <a :href="d(item).link" target="_blank" rel="noopener noreferrer">
                  <v-icon size="small" icon="mdi-download" />
                  {{ d(item).name }}
                </a>
              </div>
            </v-card>
          </div>
        </div>
      </v-col>
      <v-col cols="12" md="4">
        <v-img :src="manifest.image_url" max-height="300px" />
        <div v-if="manifest.website" class="mt-2 text-center">
          <cc-button target="_blank" :href="manifest.website" color="primary" size="small">
            <v-icon prepend class="mr-1">mdi-open-in-new</v-icon>
            Author's Website
          </cc-button>
        </div>
      </v-col>
    </v-row>
  </v-card-text>
</template>

<script lang="ts">
import { ContentPack } from '@/class';
import { IContentPack, IContentPackManifest, ContentPackDependency } from '@/interface';
import _ from 'lodash';
import { PropType } from 'vue';
import { CompendiumStore } from '@/stores';

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
      skills: ['skill', 'skills'],
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
      sitreps: ['sitrep', 'sitreps'],
      tables: ['Data Table', 'Data Tables'],
      eidolonLayers: ['Eidolon Layer', 'Eidolon Layers'],
    },
  }),

  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
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
    packDependencies() {
      const manifest = (
        (this.pack as any).manifest
          ? (this.pack as IContentPack).manifest
          : (this.pack as ContentPack).Manifest
      ) as IContentPackManifest;

      return manifest.dependencies ? manifest.dependencies : [];
    },
  },
  methods: {
    parseVersion(version) {
      if (version.includes('*')) return 'any version';
      if (version.includes('=')) return version.replace('=', '');
      return version + ' or later';
    },
    d(dep: ContentPackDependency) {
      return {
        name: dep.name,
        version: this.parseVersion(dep.version),
        link: dep.link,
        installed: CompendiumStore().packAlreadyInstalled(dep.name, dep.version),
      };
    },
  },
};
</script>
