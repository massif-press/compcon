<template>
  <component
    v-if="componentLoader"
    :is="componentLoader"
    :item="item"
    :notes="notes"
    :smallTags="smallTags"
    :dense="dense"
    :charts="charts"
    :collapse-actions="collapseActions || mobile"
    :tier="tier" />
</template>

<script lang="ts">
import * as cards from './items';

export default {
  name: 'CCItemCard',
  props: {
    item: Object,
    notes: {
      type: Boolean,
    },
    smallTags: {
      type: Boolean,
    },
    dense: {
      type: Boolean,
    },
    charts: {
      type: Boolean,
    },
    collapseActions: {
      type: Boolean,
    },
    tier: {
      type: Number,
      required: false,
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

      let t = this.item.ItemType;

      if (t === 'NpcReaction' || t === 'NpcSystem') t = 'NpcTrait';

      t += 'Card';

      if (!cards[t]) {
        console.error(`No card found for item type ${t}`);
        return null;
      }

      return cards[t];
    },
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
  },
};
</script>
