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
        <div class="pt-2">
          <h4>
            Dependencies
            <v-tooltip location="top" max-width="300px">
              <template v-slot:activator="{ props }">
                <v-icon
                  v-bind="props"
                  size="small"
                  icon="mdi-information-outline"
                  class="fade-select"
                />
              </template>
              Dependencies are other content packs that this pack requires to function properly.
              They must be installed and activated for this pack to load correctly.
            </v-tooltip>
          </h4>
          <i v-if="packDependencies.length === 0" class="pl-2">None</i>
          <div v-else>
            <v-card
              v-for="item in packDependencies"
              :variant="d(item).installed ? 'outlined' : 'tonal'"
              :color="d(item).installed ? 'secondary' : 'error'"
              size="small"
              class="ma-1 pa-1"
            >
              <div class="font-weight-bold">
                <v-icon
                  :icon="d(item).installed ? 'mdi-check' : 'mdi-close'"
                  :color="d(item).installed ? 'success' : 'error'"
                  class="mr-1"
                />
                {{ d(item).name }} @ {{ d(item).version }}
              </div>
              <div
                class="text-caption px-2"
                v-html="
                  d(item).installed
                    ? 'Dependency installed'
                    : `${manifest.name} requires Lancer Content Pack <b>${d(item).name} @ ${
                        d(item).version
                      }</b> to be installed before it can be loaded.`
                "
              />
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
import Vue from 'vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'
import { ContentPack } from '@/class'
import { IContentPack, IContentPackManifest } from '@/interface'
import _ from 'lodash'
import { PropType } from 'vue'

export default Vue.extend({
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
      skills: ['skill', 'skills'],
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
    },
  }),

  computed: {
    manifest() {
      return (this.pack as IContentPack).manifest
        ? (this.pack as IContentPack).manifest
        : (this.pack as ContentPack).Manifest
    },
    packContents() {
      const data = (this.pack as IContentPack).data
        ? (this.pack as IContentPack).data
        : (this.pack as ContentPack).Data
      return _.toPairs(data)
        .map(([key, value]: [string, object[]]) => {
          const count = value.length
          return [key, count]
        })
        .filter(([, count]) => Number(count) > 0)
        .map(([key, count]) => {
          const pair = this.humanReadableMap[key]
          if (!pair) return { count, name: `${key}--NOT--HUMANIZED` }
          const [singular, plural]: [string, string] = pair
          return { count, name: Number(count) > 1 ? plural : singular }
        })
    },
    packDependencies() {
      const manifest = (
        (this.pack as any).manifest
          ? (this.pack as IContentPack).manifest
          : (this.pack as ContentPack).Manifest
      ) as IContentPackManifest

      return manifest.dependencies ? manifest.dependencies : []
    },
  },
  methods: {
    parseVersion(version) {
      if (version.includes('*')) return 'any version'
      if (version.includes('=')) return version.replace('=', '')
      return version + ' or later'
    },
    d(dep: any) {
      return {
        name: dep.name,
        version: this.parseVersion(dep.version),
        link: dep.link,
        installed: getModule(CompendiumStore, this.$store).packAlreadyInstalled(
          dep.name,
          dep.version
        ),
      }
    },
  },
})
</script>
