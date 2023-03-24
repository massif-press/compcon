<template>
  <div>
    <component
      v-if="list"
      :is="listComponent"
      :item="item"
      :big="big"
      :list="list"
      :odd="odd"
      @open="$emit('open', $event)"
    />
    <component
      v-else
      :is="cardComponent"
      :item="item"
      :big="big"
      :odd="odd"
      :list="list"
      @open="$emit('open', $event)"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: 'gm-item-card',
  props: {
    item: { type: Object, required: true },
    big: { type: Boolean },
    list: { type: Boolean },
    odd: { type: Boolean },
  },
  mounted() {
    console.log(this.item.ItemType);
  },
  computed: {
    type() {
      return (
        this.item.ItemType.charAt(0).toUpperCase() + this.item.ItemType.slice(1)
      );
    },
    cardComponent() {
      if (!this.item) {
        return null;
      }
      return () => {
        try {
          return import(`./gmItemCards/GM${this.type}Card.vue`);
        } catch (error) {
          console.error(`Unable to load component ${this.type}`);
          return null;
        }
      };
    },
    listComponent() {
      if (!this.item) {
        return null;
      }
      return () => {
        try {
          return import(`./gmItemCards/GM${this.type}ListItem.vue`);
        } catch (error) {
          console.error(`Unable to load component ${this.type}`);
          return null;
        }
      };
    },
  },
};
</script>
