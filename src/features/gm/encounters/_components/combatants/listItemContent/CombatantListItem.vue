<template>
  <component :is="component"
    v-if="component"
    :item="item"
    :odd="odd"
    :readonly="readonly" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import cDoodadListItem from './cDoodadListItem.vue'
import cUnitListItem from './cUnitListItem.vue'
import cEidolonListItem from './cEidolonListItem.vue'
import logger from '@/user/logger'

const props = withDefaults(defineProps<{
  item: Record<string, any>
  odd?: boolean
  readonly?: boolean
}>(), { readonly: false })

const component = computed(() => {
  if (!props.item) {
    logger.error('No item provided to CombatantListItem', null)
    return null
  }
  if (!props.item.ItemType && !props.item.type) {
    logger.error('No item type provided to CompendiumCard', null)
    return null
  }
  const t = (props.item.ItemType ? props.item.ItemType : props.item.type).toLowerCase()
  if (t === 'doodad') return cDoodadListItem
  else if (t === 'unit') return cUnitListItem
  else return cEidolonListItem
})
</script>
