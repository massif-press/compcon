<template>
  <div>
    <v-tooltip v-for="s in sortedStats" location="top" open-delay="300">
      <template #activator="{ props }">
        <v-chip size="x-small" class="mr-1 mb-1" v-bind="props"
          ><v-icon :icon="s.icon" start /> {{ statController.MaxStats[s.key] }}
        </v-chip>
      </template>
      <span
        >{{ s.title }}&nbsp;<cc-slashes />&nbsp;<b>{{ statController.MaxStats[s.key] }}</b></span
      >
    </v-tooltip>
  </div>
</template>

<script lang="ts">
export default {
  name: 'gm-stat-chip-display',
  props: {
    statController: { type: Object, required: true },
  },
  computed: {
    sortedStats() {
      if (!this.statController || !this.statController.DisplayKeys.length) return [];
      return this.statController.DisplayKeys.sort((a, b) => {
        return a.sort - b.sort;
      });
    },
  },
};
</script>
