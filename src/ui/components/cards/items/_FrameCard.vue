<template>
  <v-row dense
    align="center">
    <v-col>
      <div class="heading h2">{{ item.Source }} {{ item.MechTypeString }} Frame</div>
      <div v-if="item.Variant"
        class="heading h4 text-accent">{{ item.Variant }} Variant Frame</div>
    </v-col>
    <v-col cols="auto">
      <cc-tooltip :icon="item.SizeIcon"
        size="65">
        <div class="heading h3">Size {{ item.Size === 0.5 ? '½' : item.Size }}</div>
        <v-divider class="my-1" />
        {{ glossary('size') }}
      </cc-tooltip>
    </v-col>
  </v-row>
  <v-row align="start"
    dense>
    <v-col>
      <div v-if="item.Description">
        <div class="text-cc-overline my-1 text-text">COMPENDIUM ENTRY</div>
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
    <div class="text-cc-overline text-text">COMBAT PROFILE</div>
    <frame-combat-chart :frame="item" />
  </div>

  <div class="text-cc-overline text-text">FRAME TRAITS</div>
  <cc-masonry-grid :items="item.Traits">
    <template #default="{ item, index }">
      <cc-trait-item :trait="item"
        :color="mColor"
        style="height: 100%" />
    </template>
  </cc-masonry-grid>

  <br />
  <div class="text-cc-overline text-text">AVAILABLE WEAPON MOUNTS</div>
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
            <v-card-text class="heading h3 px-8 text-uppercase">{{ m }} Mount</v-card-text>
          </v-card>
        </template>
        <p v-html-safe="get_mount_tooltip(m)" />
      </v-tooltip>
    </v-col>
  </v-row>

  <div class="text-cc-overline text-text">ONBOARD CORE SYSTEM</div>
  <cc-core-system-panel :frame="item" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import { FrameCombatChart } from '../frame'
import { glossary as glossaryData } from '@massif/lancer-data'

const { smAndDown: mobile } = useDisplay()

const props = defineProps<{
  item: Record<string, any>
  notes?: boolean
  smallTags?: boolean
  dense?: boolean
  charts?: boolean
  collapseActions?: boolean
  tier?: number
}>()

const mColor = computed(() => props.item.ManufacturerColor)

function glossary(name: string) {
  return glossaryData.find((x) => x.name.toLowerCase() === name.toLowerCase())!.description
}

function get_mount_tooltip(mount_type: string) {
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
