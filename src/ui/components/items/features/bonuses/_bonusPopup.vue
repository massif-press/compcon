<template>
  <v-tooltip location="top" max-width="300">
    <template #activator="{ props }">
      <v-icon v-bind="props" class="mt-n2" icon="cc:accuracy" />
    </template>
    <bonus-panel :bonus="bonus" />
  </v-tooltip>
</template>

<script lang="ts">
import BonusPanel from './_bonusPanel.vue';

export default {
  name: 'bonus-popup',
  components: { BonusPanel },
  props: {
    bonus: {
      type: Object,
      required: true,
    },
    tier: {
      type: Number,
      required: false,
    },
  },
};
</script>
