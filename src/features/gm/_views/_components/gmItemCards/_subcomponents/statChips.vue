<template>
  <div>
    <v-tooltip v-for="s in sortedStats" :key="s.key" location="top" open-delay="300">
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

<script setup lang="ts">
import { computed } from 'vue'
import { Bonus } from '@/classes/components/feature/bonus/Bonus';

defineOptions({ name: 'gm-stat-chip-display' })

const props = withDefaults(defineProps<{
  statController: object
  bonuses?: Bonus[]
}>(), {
  bonuses: () => []
})

const sortedStats = computed(() => {
      if (!props.statController || !props.statController.DisplayKeys.length) return [];
      return props.statController.DisplayKeys.sort((a, b) => {
        return a.sort - b.sort;
      });
    })

function totalWithBonus(key) {
      const bonuses = getBonuses(key);
      const value = props.statController.MaxStats[key] as number;
      return value + bonuses.reduce((acc, x) => acc + Number(x.Value), 0);
    }
function getBonuses(key: string) {
      if (!props.bonuses) return [];
      return (props.bonuses as Bonus[]).filter((x) => x.ID === key);
    }
</script>
