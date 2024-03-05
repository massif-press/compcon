<template>
  <v-card-text>
    {{ bonus.Detail }}
  </v-card-text>
</template>

<script lang="ts">
export default {
  name: 'bonus-base',
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
