<template>
  <div v-show="!item.NoBonus">
    <v-tooltip v-for="b in item.Bonuses">
      <template #activator="{ props }">
        <v-icon size="large" color="accent" icon="cc:accuracy" v-bind="props" />
      </template>
      <div class="heading h4">
        Bonus:
        <span class="text-accent" v-text="b.Title" />
      </div>
      <v-divider />
      <p v-text="b.Detail" />
    </v-tooltip>
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
