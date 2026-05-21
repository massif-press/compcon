<template>
  <v-list-item tile
    :class="selected && !equippable ? 'bg-primary' : ''"
    :style="selected && equippable ? 'border: 3px solid rgb(var(--v-theme-primary)' : ''"
    height="0px"
    style="padding-left: 20px!important;"
    @click="$emit('clicked')">
    <template #title>
      <span class="text-button">
        <slot v-if="compare && !selected"
          name="checkbox" />
        <v-icon v-else-if="item.IsExotic"
          start
          class="ml-3"
          icon="mdi-star"
          color="exotic" />
        <v-icon v-else
          start
          class="ml-3"
          :icon="(item as CompendiumItem).Icon" />
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

<script lang="ts">
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CompendiumItem } from '@/classes/CompendiumItem'

export default {
  name: 'BrowserListItem',
  props: {
    comparisons: {
      type: Array,
      default: () => [],
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
  emits: ['clicked', 'equip'],
};
</script>
