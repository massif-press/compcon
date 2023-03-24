<template>
  <v-tooltip top>
    <template v-slot:activator="{ props }">
      <v-icon v-bind="props">cc:accuracy</v-icon>
    </template>
    <bonus-base :bonus="bonus" />
  </v-tooltip>
</template>

<script lang="ts">
import bonusBase from './_bonusBase.vue';

export default {
  name: 'bonus-popup',
  components: { bonusBase },
  props: {
    bonus: {
      type: Object,
      required: true,
    },
  },
};
</script>
