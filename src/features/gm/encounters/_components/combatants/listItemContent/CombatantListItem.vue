<template>
  <component :is="component" v-if="component" :item="item" :odd="odd" />
</template>

<script lang="ts">
import cDoodadListItem from './cDoodadListItem.vue';
import cUnitListItem from './cUnitListItem.vue';
import cEidolonListItem from './cEidolonListItem.vue';

export default {
  name: 'gm-combatant-list-item',
  props: {
    item: { type: Object, required: true },
    odd: { type: Boolean },
  },
  computed: {
    component() {
      if (!this.item) {
        console.error('No item provided to CombatantListItem');
        return null;
      }

      if (!this.item.ItemType && !this.item.type) {
        console.error('No item type provided to CompendiumCard');
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
