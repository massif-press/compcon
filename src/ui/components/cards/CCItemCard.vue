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
import logger from '@/user/logger';
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
        logger.error('No item provided to CCItemCard', this);
        return null;
      }

      if (!this.item.ItemType && !this.item.type) {
        logger.error('No item type provided to CCItemCard', this);
        return null;
      }

      let t = this.item.ItemType;

      if (t === 'NpcReaction' || t === 'NpcSystem') t = 'NpcTrait';

      t += 'Card';

      if (!cards[t]) {
        logger.error(`No card found for item type ${t}`, this);
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
