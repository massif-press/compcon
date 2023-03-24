<template>
  <v-card-text>
    {{ bonus }}
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
  },
};
</script>
