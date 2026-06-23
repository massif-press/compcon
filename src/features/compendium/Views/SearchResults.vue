<template>
  <v-container :class="mobile ? 'py-0 px-2' : 'px-12'"
    fluid>
    <v-row align="center">
      <v-col>
        <div class="heading h2 my-n2">
          {{ $t('common.search') }}
        </div>
      </v-col>
    </v-row>
    <v-row justify="center"
      class="mb-4">
      <v-col cols="12"
        sm="10"
        md="8">
        <cc-text-field v-model="searchText"
          color="primary"
          class="search-field"
          icon="mdi-magnify"
          :placeholder="$t('common.search')" />
      </v-col>
    </v-row>
    <v-divider class="mb-2" />
    <v-card-text :style="!mobile && 'height: calc(100vh - 198px); overflow-y: scroll'">
      <template v-if="searchText.length >= 3">
        <v-row align="center">
          <v-col>
            <div class="heading h3">
              <cc-slashes />
              {{ $t('common.compendium') }}
            </div>
          </v-col>
          <v-col cols="auto">
            <i class="text-overline">
              {{ $t('compendium.search.resultCount', { count: compendiumResults.length },
                compendiumResults.length) }}
            </i>
          </v-col>
        </v-row>
        <v-slide-y-reverse-transition mode="out-in">
          <cc-masonry-grid :key="searchText"
            :items="compendiumResults">
            <template #default="{ item }">
              <CCSearchResultModal :item="item" />
            </template>
          </cc-masonry-grid>
        </v-slide-y-reverse-transition>

        <v-divider class="my-6" />

        <v-row align="center">
          <v-col>
            <div class="heading h3">
              <cc-slashes />
              {{ $t('compendium.titles.reference') }}
            </div>
          </v-col>
          <v-col cols="auto">
            <i class="text-overline">
              {{ $t('compendium.search.resultCount', { count: srdResults.length },
                srdResults.length) }}
            </i>
          </v-col>
        </v-row>
        <v-container>
          <v-card v-for="(result, index) in srdResults"
            :key="`srd-${index}`"
            class="py-2 px-3 mb-4">
            <v-row dense>
              <v-col>
                <div v-html-safe="highlightText(result.title)"
                  class="result-headline heading h4" />
              </v-col>
              <v-col cols="auto"
                align-self="start">
                <cc-button size="x-small"
                  color="primary"
                  append-icon="mdi-arrow-right"
                  @click="itemLink(result)">
                  {{ result.location.replace(/-|_/g, ' ') }}
                </cc-button>
              </v-col>
            </v-row>
            <v-card-text :class="!mobile && 'px-12'">
              <div v-html-safe="highlightText(result.content)"
                class="result-body" />
            </v-card-text>
          </v-card>
        </v-container>
      </template>
      <i v-else
        class="text-overline">
        {{ $t('compendium.search.resultCount', { count: 0 }, 0) }}
      </i>
    </v-card-text>
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import CCSearchResultModal from '@/ui/components/cards/CCSearchResultModal.vue'
import { useDisplay } from 'vuetify'
import { flatten as lodashFlatten, values, pick, uniqBy } from 'lodash-es'
import { CompendiumItem } from '@/classes/CompendiumItem'
import { accentInclude } from '@/classes/utility/accent_fold'
import { CompendiumStore } from '@/stores'
import basics from '@/assets/srd/lib/basics.json'
import combat from '@/assets/srd/lib/combat.json'
import mechs from '@/assets/srd/lib/mechs.json'
import pilots from '@/assets/srd/lib/pilots.json'
import narrative_play from '@/assets/srd/lib/narrative_play.json'

const router = useRouter()
const route = useRoute()
const { smAndDown: mobile } = useDisplay()

const searchText = ref('')

watch(
  () => route.query.search,
  (val) => { searchText.value = Array.isArray(val) ? (val[0] ?? '') : ((val as string) ?? '') },
  { immediate: true }
)

// Compendium item results

const validCompendiumItems = computed(() =>
  lodashFlatten(
    values(
      pick(CompendiumStore(), [
        'Frames',
        'MechSystems',
        'MechWeapons',
        'WeaponMods',
        'Talents',
        'PilotGear',
        'Reserves',
        'Actions',
        'CoreBonuses',
        'NpcFeatures',
        'NpcClasses',
        'NpcTemplates',
        'Backgrounds',
        'Bonds',
        'Skills',
      ])
    )
  ) as CompendiumItem[]
)

const compendiumResults = computed(() => {
  if (searchText.value.length < 3) return []
  return validCompendiumItems.value.filter(
    (r) => !r.IsHidden && accentInclude(r.Name, searchText.value)
  )
})

// SRD reference results

function fillDataObject(data, refName) {
  const out = [] as any[]
  for (const key in data) {
    out.push({
      title: data[key].title.en,
      content: data[key].content.en,
      location: refName,
      children: data[key].children?.map((c: any) => ({
        title: c.title.en,
        content: c.content.en,
        location: refName,
        children: c.children?.map((cb: any) => ({
          title: cb.title.en,
          content: cb.content.en,
          location: refName,
        })),
      })),
    })
  }
  return out
}

function flatten(data) {
  const out = [] as { title: string; content: string; location: string }[]
  data.forEach((e) => {
    out.push({ title: e.title, content: e.content, location: e.location })
    if (e.children) out.push(...flatten(e.children))
  })
  return out
}

function extract(str) {
  const pattern = '<span class="highlight">'
  const maxLength = 500
  if (str.length <= maxLength) return str
  const patternIndex = str.indexOf(pattern)
  if (patternIndex === -1) return str.substring(0, maxLength)
  let start = Math.max(0, patternIndex - Math.floor(maxLength / 2))
  let end = start + maxLength
  if (end > str.length) {
    end = str.length
    start = end - maxLength
  }
  return str.substring(start, end)
}

const srdRaw = [
  ...fillDataObject(basics, 'basics'),
  ...fillDataObject(combat, 'combat'),
  ...fillDataObject(mechs, 'mechs'),
  ...fillDataObject(pilots, 'pilots'),
  ...fillDataObject(narrative_play, 'narrative_play'),
]
const srdData = flatten(srdRaw)

const searchRegex = computed(() => {
  const escaped = searchText.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(escaped, 'gi')
})

const srdResults = computed(() => {
  if (searchText.value.length < 3) return []
  const s = searchText.value.toLowerCase()
  const matched = srdData.filter(
    (d) => d.title.toLowerCase().includes(s) || d.content.toLowerCase().includes(s)
  )
  return uniqBy(matched, 'title').sort((a, b) => {
    const aT = (a.title.match(searchRegex.value) ?? []).length
    const bT = (b.title.match(searchRegex.value) ?? []).length
    if (aT !== bT) return bT - aT
    return (b.content.match(searchRegex.value) ?? []).length - (a.content.match(searchRegex.value) ?? []).length
  })
})

function highlightText(sourceText: string) {
  const text = sourceText.replace(/<[^>]*>/g, '')
  let out = text.replace(searchRegex.value, (match) => `<span class="highlight">${match}</span>`)
  if (out.length > 500) out = extract(out)
  return out
}

function itemLink(item: any) {
  router.push({ name: `srd_${item.location}`, query: { preScroll: item.title } })
}
</script>

<style scoped>
.result-body :deep(.highlight) {
  background-color: rgba(255, 230, 0, 0.336);
}

.result-headline :deep(.highlight) {
  background-color: rgba(255, 230, 0, 0.3);
}
</style>
