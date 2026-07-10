<template>
  <b-list-item v-for="item in items"
    :key="item.ID"
    v-memo="[item.ID, selectedItem?.ID === item.ID, comparisons.includes(item), isEquippable(item), activeIds.includes(item.ID), view]"
    :selected="selectedItem?.ID === item.ID"
    :active="activeIds.includes(item.ID)"
    :icon-override="itemType === 'CoreBonus' ? (item.Manufacturer?.Icon || 'cc:corebonus') : undefined"
    :outline="outlineSelected"
    :compare="view === 'compare'"
    :item="<CompendiumItem>item"
    :equippable="isEquippable(item)"
    v-model:comparisons="comparisons"
    @equip="handleEquip(item)"
    @clicked="toggleItem(item)" />
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import bListItem from './_b-list-item.vue'
import { CompendiumItem } from '@/classes/CompendiumItem'
import { CompendiumBrowserKey } from '../browserContext'

defineOptions({ name: 'BrowserItemList' })

defineProps<{ items: any[] }>()

const ctx = inject(CompendiumBrowserKey)!
const { selectedItem, comparisons, view, isEquippable, toggleItem, handleEquip } = ctx
const itemType = computed(() => ctx.props.itemType)
const activeIds = computed<string[]>(() => ctx.props.activeIds ?? [])
const outlineSelected = computed<boolean>(() => !!ctx.props.outlineSelected)
</script>
