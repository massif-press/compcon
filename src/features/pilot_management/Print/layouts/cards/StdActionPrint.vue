<template>
  <action-card v-for="a in actions" :action="a" />
</template>

<script lang="ts">
import { CompendiumStore } from '@/stores';
import ActionCard from './components/ActionCard.vue';

export default {
  name: 'pilot-print',
  components: {
    ActionCard,
  },
  computed: {
    actions() {
      return CompendiumStore()
        .Actions.filter((a) => a && !a.IsDowntimeAction)
        .sort((a, b) => (a.Name > b.Name ? 1 : -1));
    },
  },
};
</script>
