<template>
  <v-list-item tile
    :class="selected && !equippable && !outline ? 'bg-primary' : ''"
    :style="[
      selected && equippable ? { border: '3px solid rgb(var(--v-theme-primary))' } : {},
      selected && outline ? { border: '2px solid rgb(var(--v-theme-accent))' } : {},
      active ? { backgroundColor: 'rgba(var(--v-theme-primary), 0.15)' } : {},
    ]"
    height="0px"
    style="padding-left: 20px!important;"
    @click="$emit('clicked')">
    <template #title>
      <span class="text-button">
        <v-checkbox-btn v-if="compare && !selected"
          v-model="comparisons"
          density="compact"
          class="d-inline ml-3"
          :value="item"
          @click.stop />
        <v-icon v-else-if="item.IsExotic"
          start
          class="ml-3"
          icon="mdi-star"
          color="exotic" />
        <v-icon v-else
          start
          class="ml-3"
          :icon="iconOverride || (item as CompendiumItem).Icon" />
        {{ (item as CompendiumItem).Name }}
      </span>
    </template>
    <template v-if="equippable"
      #append>
      <cc-button :title="`Select ${item.Name}`"
        icon="mdi-plus"
        size="small"
        variant="outlined"
        color="secondary"
        class="mt-n4"
        @click.stop="$emit('equip', item)"></cc-button>
    </template>
  </v-list-item>
</template>

<script setup lang="ts">
import { CompendiumItem } from '@/classes/CompendiumItem'

defineOptions({ name: 'BrowserListItem' })

defineProps<{
  item: CompendiumItem
  compare?: boolean
  selected?: boolean
  equippable?: boolean
  active?: boolean
  outline?: boolean
  iconOverride?: string
}>()

const comparisons = defineModel<any[]>('comparisons', { default: () => [] })

defineEmits<{
  'clicked': []
  'equip': [payload: any]
}>()
</script>
