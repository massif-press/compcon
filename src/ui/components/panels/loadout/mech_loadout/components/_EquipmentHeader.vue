<template>
  <v-row dense align="center">
    <v-col v-if="item.IsLimited" cols="auto" class="mx-2">
      <cc-item-uses :item="item" :bonus="useBonus" :color="color" class="d-inline" />
      <span class="text-overline">({{ item.Uses }}/{{ item.getTotalUses(useBonus) }}) USES</span>
    </v-col>

    <v-col cols="auto">
      <slot name="left" />
    </v-col>
    <v-col cols="auto">
      <slot />
    </v-col>
  </v-row>
</template>

<script lang="ts">
export default {
  name: 'equipment-header',
  props: {
    item: {
      type: Object,
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: null,
    },
    useBonus: {
      type: Number,
      required: false,
      default: 0,
    },
    interior: {
      type: Boolean,
    },
    dark: {
      type: Boolean,
    },
    mod: {
      type: Boolean,
    },
  },
};
</script>
