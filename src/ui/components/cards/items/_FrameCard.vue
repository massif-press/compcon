<template>
  <v-row dense
    align="center">
    <v-col>
      <div class="heading h2">{{ item.Source }} {{ $t('compendium.content.frameSuffix', { type: item.MechTypeString }) }}
      </div>
      <div v-if="item.Variant"
        class="heading h4 text-accent">{{ item.Variant }} {{ $t('ui.card.variantFrame') }}</div>
    </v-col>
    <v-col cols="auto">
      <cc-tooltip :icon="item.SizeIcon"
        size="65">
        <div class="heading h3"><span class="text-uppercase">{{ $t('ui.fields.size') }}</span> {{ item.Size === 0.5 ? '½' : item.Size }}
        </div>
        <v-divider class="my-1" />
        <div v-html-safe="glossary('size')" />
      </cc-tooltip>
    </v-col>
  </v-row>
  <v-row align="start"
    dense>
    <v-col>
      <div v-if="item.Description">
        <div class="text-cc-overline my-1 text-text">{{ $t('ui.action.compendiumEntry') }}</div>
        <p v-html-safe="item.Description"
          class="flavor-text" />
      </div>
    </v-col>
    <v-col :order="mobile ? 'first' : 'last'"
      cols="12"
      md="5">
      <v-img :src="item.DefaultImage"
        max-height="100vh" />
    </v-col>
  </v-row>

  <div class="my-4">
    <div class="text-cc-overline text-text">{{ $t('ui.card.combatProfile') }}</div>
    <frame-combat-chart :frame="item" />
  </div>

  <div class="text-cc-overline text-text">{{ $t('active.roster.frameTraits') }}</div>
  <cc-masonry-grid :items="item.Traits">
    <template #default="{ item, index }">
      <cc-trait-item :trait="item"
        :color="mColor"
        style="height: 100%" />
    </template>
  </cc-masonry-grid>

  <br />
  <div class="text-cc-overline text-text">{{ $t('ui.card.availableMounts') }}</div>
  <v-row justify="space-around"
    class="mb-3">
    <v-col v-for="(m, index) in item.Mounts"
      :key="`mount-${index}`">
      <v-tooltip location="bottom"
        max-width="300">
        <template #activator="{ props }">
          <v-card color="primary"
            dark
            class="clipped"
            tile
            v-bind:="props">
            <v-card-text class="heading h3 px-8 text-uppercase">{{ mountLabel(m) }}</v-card-text>
          </v-card>
        </template>
        <p v-html-safe="get_mount_tooltip(m)" />
      </v-tooltip>
    </v-col>
  </v-row>

  <div class="text-cc-overline text-text">{{ $t('ui.card.onboardCore') }}</div>
  <cc-core-system-panel :frame="item" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Frame } from '@/classes/mech/components/frame/Frame'
import { useDisplay } from 'vuetify'
import { FrameCombatChart } from '../frame'
import { glossary as glossaryData } from '@massif/lancer-data'
import { useI18n } from 'vue-i18n'
import { slug } from '@/i18n/contentKeys.mjs'
import { localize } from '@/i18n/localize'

const { t, te } = useI18n()
const { smAndDown: mobile } = useDisplay()

const mountSrdKeyMap: Record<string, string> = {
  Main: 'mechs_2_3_0',
  Heavy: 'mechs_2_3_1',
  'Aux/Aux': 'mechs_2_3_2',
  'Main/Aux': 'mechs_2_3_3',
  Flex: 'mechs_2_3_4',
  Integrated: 'mechs_2_3_5',
}

function mountLabel(m: string) {
  const srdKey = mountSrdKeyMap[m]
  if (srdKey) {
    const title = localize(srdKey, 'title', '')
    if (title) return title
  }
  const key = `enums.mountType.${slug(m)}`
  const mountTypeName = te(key) ? t(key) : m
  return `${mountTypeName} ${t('common.mount')}`
}

const props = defineProps<{
  item: Frame
  notes?: boolean
  smallTags?: boolean
  dense?: boolean
  charts?: boolean
  collapseActions?: boolean
  tier?: number
}>()

const mColor = computed(() => props.item.ManufacturerColor)

function glossary(name: string) {
  if (name.toLowerCase() === 'size') {
    const localizedSize = localize('mechs_2_1', 'content', '')
    if (localizedSize) return localizedSize
  }
  const n = glossaryData.find((x) => x.name.toLowerCase() === name.toLowerCase())
  return n ? n.description : ''
}

function get_mount_tooltip(mount_type: string) {
  const srdKey = mountSrdKeyMap[mount_type]
  if (srdKey) {
    const content = localize(srdKey, 'content', '')
    if (content) return content
  }

  const mount_tooltips: Record<string, string> = {
    Heavy: 'Holds one <b>HEAVY</b>, <b>MAIN</b>, or <b>AUXILIARY</b> weapon',
    Main: 'Holds one <b>MAIN</b> or <b>AUXILIARY</b> weapon',
    'Aux/Aux': 'Holds up to two <b>AUXILIARY</b> weapons',
    Aux: 'Holds one <b>AUXILIARY</b> weapon',
    'Main/Aux':
      'Holds one <b>MAIN</b> weapon and one <b>AUXILIARY</b> weapon, or two <b>AUXILIARY</b> weapons',
    Flex: 'Holds either one <b>MAIN</b> weapon or up to two <b>AUXILIARY</b> weapons',
  }
  if (mount_type in mount_tooltips) {
    return mount_tooltips[mount_type]
  }
  return 'Error: Unknown Mount Type'
}
</script>
