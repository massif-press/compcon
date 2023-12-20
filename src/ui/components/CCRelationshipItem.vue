<template>
  <v-chip
    >test

    <v-menu open-on-hover activator="parent"> hello world </v-menu>
  </v-chip>
</template>

<script lang="ts">
import { CollectionItem } from '@/classes/narrative/CollectionItem';
import { NarrativeStore } from '@/stores';

// id: string;
// name: string;
// relationship: string;
// note: string;

export default {
  name: 'cc-relationship-item',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  computed: {
    linkItem(): CollectionItem | null {
      return NarrativeStore().getItemByID(this.item.id);
    },
  },
};
</script>
