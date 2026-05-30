<template>
  <action-card v-for="(a, index) in actions" :key="`action-${index}`" :action="a" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CompendiumStore } from '@/stores';
import ActionCard from './components/ActionCard.vue';

defineOptions({ name: 'pilot-print' })

const actions = computed(() => {
      return CompendiumStore()
        .Actions.filter((a) => a && !a.IsDowntimeAction)
        .sort((a, b) => (a.Name > b.Name ? 1 : -1));
    })
</script>
