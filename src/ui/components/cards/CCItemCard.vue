<template>
  <component
    :is="componentLoader"
    v-if="componentLoader"
    :item="item"
    :notes="notes"
    :smallTags="smallTags"
    tabindex="0"
  />
</template>

<script lang="ts">
export default {
  name: 'CCItemCard',
  props: {
    item: {
      type: Object,
      required: true,
    },
    notes: {
      type: Boolean,
      required: false,
    },
    smallTags: {
      type: Boolean,
      required: false,
    },
  },
  computed: {
    componentLoader(): any {
      if (!this.item) {
        return null;
      }
      return () => {
        try {
          const t = this.item.ItemType
            ? this.item.ItemType
            : `Npc${this.item.type}`;
          return import(`./_${t}Card.vue`);
        } catch (error) {
          console.error(`Unable to load component ${this.item.ItemType}`);
          return null;
        }
      };
    },
  },
};
</script>
