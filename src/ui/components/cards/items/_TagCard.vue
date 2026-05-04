<template>
  <div v-html-safe="item.GetDescription()" />
</template>

<script lang="ts">
export default {
  name: 'CcTagCard',
  props: {
    item: { type: Object, required: true },
  },
};
</script>
