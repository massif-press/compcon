<template>
  <v-list-item
    tile
    :class="selected && !equippable ? 'bg-primary' : ''"
    :style="selected && equippable ? 'border: 3px solid rgb(var(--v-theme-primary)' : ''"
    height="0px"
    @click="$emit('clicked')">
    <template #title>
      <span class="text-button">
        <slot v-if="compare && !selected" name="checkbox" />
        <v-icon v-else-if="item.IsExotic" start class="ml-3" icon="mdi-star" color="exotic" />
        <v-icon v-else start class="ml-3" :icon="(item as CompendiumItem).Icon" />
        {{ (item as CompendiumItem).Name }}
      </span>
    </template>
    <template #append v-if="equippable">
      <v-tooltip>
        <template v-slot:activator="{ props }">
          <cc-button
            v-bind="props"
            icon="mdi-plus"
            size="small"
            variant="outlined"
            color="secondary"
            class="mt-n4"
            @click.stop="$emit('equip', item)"></cc-button>
        </template>
        <span>Select {{ item.Name }}</span>
      </v-tooltip>
    </template>
  </v-list-item>
</template>

<script lang="ts">
import { CompendiumItem } from '@/class';

export default {
  name: 'browser-list-item',
  emits: ['clicked', 'equip'],
  props: {
    comparisons: {
      type: Array,
    },
    item: {
      type: Object,
      required: true,
    },
    compare: {
      type: Boolean,
    },
    selected: {
      type: Boolean,
    },
    equippable: {
      type: Boolean,
    },
  },
};
</script>
