<template>
  <component :is="componentLoader"
    v-if="componentLoader"
    :item="item"
    :notes="notes"
    :small-tags="smallTags"
    :dense="dense"
    :charts="charts"
    :collapse-actions="collapseActions || mobile"
    :tier="tier" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import * as cards from './items'

const { smAndDown: mobile } = useDisplay()

const props = defineProps<{
  item?: Record<string, any>
  notes?: boolean
  smallTags?: boolean
  dense?: boolean
  charts?: boolean
  collapseActions?: boolean
  tier?: number
}>()

const componentLoader = computed((): any => {
  if (!props.item) {
    if (import.meta.env.DEV) console.warn('No item provided to CCItemCard')
    return null
  }

  if (!props.item.ItemType && !props.item.type) {
    if (props.item.id?.startsWith('tg_')) return (cards as any).TagCard
    if (import.meta.env.DEV) console.warn('No item type provided to CCItemCard')
    return null
  }

  let t = props.item.ItemType
  if (t === 'NpcReaction' || t === 'NpcSystem') t = 'NpcTrait'
  t += 'Card'

  if (!(cards as any)[t]) {
    if (import.meta.env.DEV) console.warn(`No card found for item type ${t}`)
    return null
  }

  return (cards as any)[t]
})
</script>
