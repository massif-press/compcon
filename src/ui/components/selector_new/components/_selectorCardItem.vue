<template>
  <compendium-card :item="item" :equipped="equipped" @equip="$emit('equip', $event)" />
</template>

<script lang="ts">
import CompendiumCard from '../../selectors/views/components/CompendiumCard.vue';
export default {
  name: 'selector-cards-view',
  components: { CompendiumCard },
  props: {
    item: {
      type: Object,
      required: true,
    },
    equipped: {
      type: Object,
      required: false,
    },
  },
  emits: ['equip'],
};
</script>
