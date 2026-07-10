<template>
  <cc-compendium-browser :items="baseCoreBonuses"
    item-type="CoreBonus"
    :options="options"
    :manufacturers="manufacturers"
    :active-ids="activeCbIds"
    outline-selected
    view-key="sel-corebonus"
    page-scroll>
    <template #item="{ item }">
      <core-bonus-select-item :bonus="item"
        :is-selectable="isSelectable(item)"
        :is-selected="isSelected(item)"
        @add="pilot.CoreBonusController.AddCoreBonus(item)"
        @remove="pilot.CoreBonusController.RemoveCoreBonus(item)" />
    </template>

    <template #header>
      <cc-button size="x-small"
        color="error"
        block
        prepend-icon="mdi-refresh"
        :disabled="!pilot.CoreBonusController.CoreBonuses.length"
        @click="pilot.CoreBonusController.ClearCoreBonuses()">
        {{ $t('common.reset') }}
      </cc-button>
    </template>

    <template #top>
      <missing-item-alert v-if="pilot.CoreBonusController.MissingCoreBonuses.length"
        :type="$t('pm.titles.coreBonuses')"
        :items="pilot.CoreBonusController.MissingCoreBonuses"
        @remove="pilot.CoreBonusController.RemoveCoreBonus($event)" />

      <selector-header :current="pilot.CoreBonusController.CurrentCBPoints"
        :max="pilot.CoreBonusController.MaxCBPoints"
        :complete="complete"
        :complete-text="$t('pm.selectors.coreBonusSelectionComplete')">
        <v-chip v-for="a in availability"
          :key="a.manufacturer.ID"
          class="ma-1"
          size="small"
          :color="a.manufacturer.GetColor($vuetify.theme.current.dark)"
          :prepend-icon="a.manufacturer.Icon">
          {{ $t('pm.selectors.coreBonusAvailable', { count: a.count, mf: a.manufacturer.ID },
            a.count) }}
        </v-chip>
        <selector-chip v-for="b in pilot.CoreBonusController.CoreBonuses"
          :key="b.ID"
          :color="b.Manufacturer?.GetColor($vuetify.theme.current.dark)"
          :prepend-icon="b.Manufacturer?.Icon || 'cc:corebonus'"
          @remove="pilot.CoreBonusController.RemoveCoreBonus(b)">
          {{ b.Name }}
        </selector-chip>
      </selector-header>
    </template>
  </cc-compendium-browser>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { orderBy } from 'lodash-es'
import { CompendiumStore } from '@/stores'
import { CoreBonus } from '@/classes/pilot/components/corebonus/CoreBonus'
import CoreBonusSelectItem from './components/_CoreBonusSelectItem.vue'
import MissingItemAlert from './components/_MissingItemAlert.vue'
import SelectorHeader from './components/_SelectorHeader.vue'
import SelectorChip from './components/_SelectorChip.vue'
import { filterByLcpConfig } from './useLcpFilter'

const props = defineProps<{ pilot: Record<string, any> }>()

const options = {
  views: ['list'],
  initialView: 'list',
  groups: ['source', 'none'],
  initialGroup: 'source',
  noSource: true,
}

const manufacturers = computed(() => CompendiumStore().Manufacturers)

const baseCoreBonuses = computed<CoreBonus[]>(() =>
  orderBy(
    filterByLcpConfig(
      CompendiumStore().CoreBonuses.filter((x: any) => !x.IsHidden),
      props.pilot.LcpConfig
    ),
    'Manufacturer'
  )
)

const activeCbIds = computed<string[]>(() =>
  props.pilot.CoreBonusController.CoreBonuses.map((x: any) => x.ID)
)

const complete = computed(() => !props.pilot.CoreBonusController.IsMissingCBs)

const availability = computed<{ manufacturer: any; count: number }[]>(() => {
  const remaining =
    props.pilot.CoreBonusController.MaxCBPoints - props.pilot.CoreBonusController.CurrentCBPoints
  if (remaining < 1) return []
  return CompendiumStore().Manufacturers
    .filter((m: any) => !m.IsHidden)
    .map((m: any) => ({ manufacturer: m, count: Math.min(availableCount(m.ID), remaining) }))
    .filter((a: any) => a.count > 0)
})

function selectedCount(m: string): number {
  return props.pilot.CoreBonusController.CoreBonuses.filter((x: CoreBonus) => x.Source === m).length
}

function availableCount(m: string): number {
  if (m.toUpperCase() === 'GMS') return Infinity
  return Math.floor(props.pilot.LicenseController.LicenseLevel(m) / 3) - selectedCount(m)
}

function isSelectable(b: CoreBonus): boolean {
  return availableCount(b.Source) > 0 && props.pilot.CoreBonusController.IsMissingCBs
}

function isSelected(b: CoreBonus): boolean {
  return props.pilot.has('CoreBonus', b.ID)
}
</script>
