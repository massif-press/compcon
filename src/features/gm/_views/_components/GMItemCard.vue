<template>
  <component :is="cardComponent" :item="item" :big="big" :odd="odd" @open="$emit('open', $event)" />
</template>

<script lang="ts">
import * as CardItems from './gmItemCards';

export default {
  name: 'gm-item-card',
  props: {
    item: { type: Object, required: true },
    big: { type: Boolean },
    list: { type: Boolean },
    odd: { type: Boolean, default: false },
  },
  emits: ['open'],
  computed: {
    type() {
      return this.item.ItemType.charAt(0).toUpperCase() + this.item.ItemType.slice(1);
    },
    cardComponent() {
      if (this.list) {
        return CardItems[`GM${this.type}ListItem`];
      }
      return CardItems[`GM${this.type}Card`];
    },
  },
};
</script>
