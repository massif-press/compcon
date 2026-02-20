<template>
  <div v-html-safe="item.GetDescription()" />
</template>

<script lang="ts">
export default {
  name: 'cc-tag-card',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>
