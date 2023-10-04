<template>
  <v-list-item
    title=""
    :class="selected && !equippable ? 'bg-primary' : ''"
    :style="selected && equippable ? 'border: 3px solid rgb(var(--v-theme-primary)' : ''"
    @click="$emit('clicked')"
  >
    <template #title>
      <span class="text-button">
        <slot v-if="compare && !selected" name="checkbox" />
        <v-icon v-else start class="ml-3" :icon="(item as CompendiumItem).Icon" />
        {{ (item as CompendiumItem).Name }}
      </span>
    </template>
    <template #append v-if="equippable">
      <v-tooltip>
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            icon
            size="20"
            variant="plain"
            color="accent"
            class="mt-n4"
            @click.stop="$emit('equip', item)"
          >
            <v-icon size="35" icon="mdi-plus-box" />
          </v-btn>
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
