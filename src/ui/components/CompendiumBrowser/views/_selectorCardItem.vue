<template>
  <compendium-card
    :item="item"
    :highlighted="highlighted"
    :selectable="selectable"
    @select="$emit('select')" />
</template>

<script lang="ts">
import CompendiumCard from '@/features/compendium/components/views/CompendiumCard.vue';

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
    selectable: {
      type: Boolean,
    },
  },
  emits: ['select'],
};
</script>
