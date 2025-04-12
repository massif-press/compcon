<template>
  <component :is="component" v-if="component" :item="item" :odd="odd" :readonly="readonly" />
</template>

<script lang="ts">
import cDoodadListItem from './cDoodadListItem.vue';
import cUnitListItem from './cUnitListItem.vue';
import cEidolonListItem from './cEidolonListItem.vue';
import logger from '@/user/logger';

export default {
  name: 'gm-combatant-list-item',
  props: {
    item: { type: Object, required: true },
    odd: { type: Boolean },
    readonly: { type: Boolean, default: false },
  },
  computed: {
    component() {
      if (!this.item) {
        logger.error('No item provided to CombatantListItem', this);
        return null;
      }

      if (!this.item.ItemType && !this.item.type) {
        logger.error('No item type provided to CompendiumCard', this);
        return null;
      }

      let t = (this.item.ItemType ? this.item.ItemType : this.item.type).toLowerCase();

      if (t === 'doodad') return cDoodadListItem;
      else if (t === 'unit') return cUnitListItem;
      else return cEidolonListItem;
    },
  },
};
</script>
