<template>
  <v-card-text :class="mobile && 'pa-0 pb-2'">
    <v-row>
      <v-col>
        <p class="body-text text-text light-panel pa-2 mb-1">
          <span v-if="manifest.description"
            v-html-safe="manifest.description" />
          <span v-else>{{ pf.noDescription }}</span>
        </p>
        <div>
          <cc-heading line>{{ pf.contentHeading }}</cc-heading>
          <div>
            <v-chip v-for="(item, itemIdx) in packContents"
              :key="`content-${itemIdx}`"
              variant="outlined"
              color="accent"
              size="small"
              class="mr-2 mb-1 text-overline rounded-s-full rounded-e-0">
              <v-avatar color="primary"
                start
                v-text="item.count" />
              {{ item.name }}
            </v-chip>
          </div>
        </div>
        <div class="pt-2">
          <cc-heading line>
            {{ pf.dependencies }}
            <cc-tooltip :text="pf.dependenciesTooltip" />
          </cc-heading>
          <i v-if="packDependencies.length === 0"
            class="pl-2">{{ pf.none }}</i>
          <div v-else>
            <v-card v-for="(item, itemIdx) in packDependencies"
              :key="`dep-${itemIdx}`"
              :variant="d(item).installed ? 'flat' : 'text'"
              :color="d(item).installed ? 'success' : 'error'"
              size="small"
              class="ma-1 pa-1">
              <div class="font-weight-bold">
                <v-icon :icon="d(item).installed ? 'mdi-check' : 'mdi-close'"
                  class="mr-1" />
                {{ d(item).name }} @ {{ d(item).version }}
              </div>
              <div class="text-caption px-2"
                v-html-safe="d(item).installed
                  ? pf.dependencyInstalled
                  : `${manifest.name} requires Lancer Content Pack <b>${d(item).name
                  } at version ${d(item).version}</b> to be installed before it can be loaded.`
                  " />
              <div v-if="d(item).link"
                class="text-caption px-2 text-right">
                <v-btn v-if="!d(item).installed"
                  flat
                  tile
                  :href="d(item).link"
                  target="_blank"
                  rel="noopener noreferrer"
                  prepend-icon="mdi-download"
                  size="x-small">
                  {{ d(item).name }}
                </v-btn>
              </div>
            </v-card>
          </div>
        </div>
        <div class="pt-2">
          <cc-heading line>
            {{ pf.changelog }}
          </cc-heading>
          <i v-if="!manifest.version_history || manifest.version_history.length === 0"
            class="pl-2">None</i>
          <div v-else>
            <v-card v-for="(item, itemIdx) in manifest.version_history"
              :key="`version-${itemIdx}`"
              class="ma-1 pa-1">
              <div class="font-weight-bold bg-primary px-2">
                {{ item.version }} ({{ new Date(item.date).toLocaleDateString() }}):
              </div>
              <div class="pa-2">
                <ul>
                  <li v-for="(change, changeIdx) in item.changes"
                    :key="`change-${changeIdx}`"
                    v-html-safe="change" />
                </ul>
              </div>
            </v-card>
          </div>
        </div>
      </v-col>
      <v-col cols="12"
        md="4">
        <v-img :src="manifest.image_url"
          max-height="300px" />
        <div v-if="manifest.website"
          class="mt-2 d-flex">
          <v-spacer />
          <cc-button target="_blank"
            prepend-icon="mdi-open-in-new"
            :href="manifest.website"
            color="primary"
            size="small">
            {{ pf.authorsWebsite }}
          </cc-button>
          <v-spacer />
        </div>
      </v-col>
    </v-row>
  </v-card-text>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import * as _ from 'lodash-es'
import { ContentPack, ContentPackDependency, IContentPack, IContentPackManifest } from '@/classes/ContentPack'
import { CompendiumStore } from '@/stores'
import { NAV_STRINGS } from '@/features/nav/strings'

const props = defineProps<{ pack: IContentPack | ContentPack }>()

const { smAndDown: mobile } = useDisplay()
const pf = NAV_STRINGS.packInfo

const humanReadableMap: Record<string, [string, string]> = {
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
  downtimeActions: ['Downtime Action', 'Downtime Actions'],
  bondPowers: ['Bond Power', 'Bond Powers'],
  extraNpcFeatures: ['Extra Npc Feature', 'Extra Npc Features'],
}

const manifest = computed(() =>
  (props.pack as IContentPack).manifest
    ? (props.pack as IContentPack).manifest
    : (props.pack as ContentPack).Manifest
)

const packContents = computed(() => {
  const data = (props.pack as IContentPack).data
    ? (props.pack as IContentPack).data
    : (props.pack as ContentPack).Data

  return _.toPairs(data)
    .map(([key, value]: [string, object[]]) => {
      const count = value.length
      return [key, count]
    })
    .filter(([, count]) => Number(count) > 0)
    .map(([key, count]) => {
      const pair = humanReadableMap[key as string]
      if (!pair) return { count, name: `${key}--NOT--HUMANIZED` }
      const [singular, plural]: [string, string] = pair
      return { count, name: Number(count) > 1 ? plural : singular }
    })
})

const packDependencies = computed(() => {
  const mf = (
    (props.pack as any).manifest
      ? (props.pack as IContentPack).manifest
      : (props.pack as ContentPack).Manifest
  ) as IContentPackManifest
  return mf.dependencies ? mf.dependencies : []
})

function parseVersion(version: string) {
  if (version.includes('*')) return 'any version'
  if (version.includes('=')) return version.replace('=', '')
  return version + ' or later'
}

function d(dep: ContentPackDependency) {
  return {
    name: dep.name,
    version: parseVersion(dep.version),
    link: dep.link,
    installed: CompendiumStore().packAlreadyInstalled(dep.name, dep.version, true),
  }
}
</script>
