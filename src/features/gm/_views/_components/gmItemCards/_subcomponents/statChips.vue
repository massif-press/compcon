<template>
  <div>
    <v-tooltip v-for="s in sortedStats" location="top" open-delay="300">
      <template #activator="{ props }">
        <v-chip label class="mr-1 mb-1" style="height: 20px" v-bind="props">
          <v-icon :icon="s.icon" start />
          {{ totalWithBonus(s.key) }}
        </v-chip>
      </template>
      <span>
        {{ s.title }}&nbsp;
        <cc-slashes />
        &nbsp;
        <b>{{ totalWithBonus(s.key) }}</b>
      </span>
    </v-tooltip>
  </div>
</template>

<script lang="ts">
import { Bonus } from '@/classes/components';

export default {
  name: 'gm-stat-chip-display',
  props: {
    statController: { type: Object, required: true },
    bonuses: { type: Array, required: false, default: () => [] },
  },
  computed: {
    sortedStats() {
      if (!this.statController || !this.statController.DisplayKeys.length) return [];
      return this.statController.DisplayKeys.sort((a, b) => {
        return a.sort - b.sort;
      });
    },
  },
  methods: {
    totalWithBonus(key) {
      const bonuses = this.getBonuses(key);
      const value = this.statController.MaxStats[key] as number;
      return value + bonuses.reduce((acc, x) => acc + Number(x.Value), 0);
    },
    getBonuses(key: string): Bonus[] {
      if (!this.bonuses) return [];
      return (this.bonuses as Bonus[]).filter((x) => x.ID.includes(key));
    },
  },
};
</script>
