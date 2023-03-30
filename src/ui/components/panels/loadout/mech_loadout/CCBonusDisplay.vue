<template>
  <div v-show="!item.NoBonus">
    <cc-tooltip
      v-for="(b, i) in item.Bonuses"
      inline
      :title="`Bonus: ${b.Title}`"
      :content="b.Detail"
    >
      <v-icon large color="accent">cc:accuracy</v-icon>
    </cc-tooltip>
  </div>
</template>

<script lang="ts">
export default {
  name: 'cc-bonus-display',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>
