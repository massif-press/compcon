<template>
  <v-chip variant="outlined" label class="ma-1">{{ name }}</v-chip>
</template>

<script lang="ts">
export default {
  name: 'special-thanks-badge',
  props: {
    name: {
      type: String,
      required: true,
    },
  },
};
</script>
