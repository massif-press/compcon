<template>
  <div>
    <v-tooltip
      v-for="s in sortedStats"
      :key="s.key"
      location="top"
      open-delay="300"
    >
      <template #activator="{ props }">
        <v-chip
          label
          class="mr-1 mb-1"
          style="height: 20px"
          v-bind="props"
        >
          <v-icon
            :icon="s.icon"
            start
          />
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
  import type { StatController } from '@/classes/components/combat/stats/StatController'
  import { computed } from 'vue'

  defineOptions({ name: 'gm-stat-chip-display' })

  const props = defineProps<{
    statController: StatController
  }>()

  const sortedStats = computed(() => {
    if (!props.statController || !props.statController.DisplayKeys.length) return []
    return [...props.statController.DisplayKeys].sort((a, b) => {
      return a.sort - b.sort
    })
  })

  function totalWithBonus(key) {
    return props.statController.getMaxWithBonuses(key)
  }
</script>
