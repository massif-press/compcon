<template>
  <v-card-text>
    {{ synergy }}
  </v-card-text>
</template>

<script lang="ts">
export default {
  name: 'synergy-base',
  props: {
    synergy: {
      type: Object,
      required: true,
    },
  },
};
</script>
