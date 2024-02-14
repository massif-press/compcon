<template>
  <component
    :is="componentLoader"
    v-if="componentLoader"
    :item="item"
    :notes="notes"
    :smallTags="smallTags"
    :dense="dense"
    :charts="charts" />
</template>

<script lang="ts">
import * as cards from './items';

export default {
  name: 'CCItemCard',
  props: {
    item: Object,
    notes: {
      type: Boolean,
      required: false,
    },
    smallTags: {
      type: Boolean,
      required: false,
    },
    dense: {
      type: Boolean,
    },
    charts: {
      type: Boolean,
    },
  },
  computed: {
    componentLoader(): any {
      if (!this.item) {
        console.error('No item provided to CCItemCard');
        return null;
      }

      if (!this.item.ItemType && !this.item.type) {
        console.error('No item type provided to CCItemCard');
        return null;
      }

      let t = this.item.ItemType ? this.item.ItemType : `Npc${this.item.type}`;

      t += 'Card';

      if (!cards[t]) {
        console.error(`No card found for item type ${t}`);
        return null;
      }

      return cards[t];
    },
  },
};
</script>
