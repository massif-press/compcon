<template>
  <compendium-card :item="item" :highlighted="highlighted" />
</template>

<script lang="ts">
import CompendiumCard from '../views/CompendiumCard.vue';
export default {
  name: 'selector-cards-view',
  components: { CompendiumCard },
  props: {
    item: {
      type: Object,
      required: true,
    },
    highlighted: {
      type: Boolean,
    },
  },
};
</script>
