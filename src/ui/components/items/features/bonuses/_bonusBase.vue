<template>
  <v-card-text class="pa-1">
    {{ bonus.Detail }}
    <div class="text-right text-disabled">
      <i>From {{ bonus.Source }}</i>
    </div>
  </v-card-text>
</template>

<script lang="ts">
export default {
  name: 'BonusBase',
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
